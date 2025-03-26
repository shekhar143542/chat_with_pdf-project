import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import pineconeClient from './pinecone'
import { PineconeStore } from '@langchain/pinecone'
import { Index, RecordMetadata } from '@pinecone-database/pinecone'
import { adminDb } from '@/firebaseAdmin'
import { auth } from '@clerk/nextjs/server'
import { generateEmbeddings,generateText} from "./embedder";
import { doc } from 'firebase/firestore'
import { Embeddings } from "@langchain/core/embeddings";
import { ChatPromptTemplate } from '@langchain/core/prompts';


export const indexName = "pdf-chat-embeddings";

interface PineconeVector {
  id: string;
  values: number[];
  metadata: { text: string };
}

class CustomEmbeddings extends Embeddings {
  constructor() {
    super({});
  }

  async embedQuery(text: string): Promise<number[]> {
    const embeddings = await generateEmbeddings([text]);
    return embeddings[0];
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return generateEmbeddings(texts);
  }
}



async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  console.log("--- Fetching chat history from the Firebase database... ---");
  const LIMIT = 6;
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`--- Fetched last ${chatHistory.length} messages successfully ---`);
  console.log(chatHistory.map( (msg) => msg.content.toString));
  return chatHistory;
}



// ✅ Function to Check If Namespace Exists in Pinecone
async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
  if (!namespace) throw new Error("No namespace value provided.");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

// ✅ Function to Extract Text from PDF and Split It
export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  console.log("--- Fetching the download URL from Firebase... ---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;
  if (!downloadUrl) throw new Error("Download URL not found");

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status} - ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  console.log(`--- PDF fetched, size: ${arrayBuffer.byteLength} bytes ---`);

  console.log("--- Loading PDF document... ---");
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const loader = new PDFLoader(blob);
  const docs = await loader.load();
  console.log(`--- Loaded ${docs.length} documents ---`);

  if (docs.length === 0) throw new Error("No text extracted from PDF. Is it image-based?");

  console.log("--- Splitting the document into smaller parts... ---");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);
  return splitDocs;
}

// ✅ Function to Generate and Store Embeddings in Pinecone
export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(`--- Namespace ${docId} already exists, reusing existing embeddings... ---`);
    return;
  }

  console.log("--- Fetching document and splitting text... ---");
  const splitDocs = await generateDocs(docId);

  console.log("--- Generating embeddings for split text... ---");
  const texts = splitDocs.map((doc) => doc.pageContent).filter((text) => text.trim() !== "");
  if (texts.length === 0) throw new Error("No valid text chunks found after splitting.");

  const embeddedTexts: number[][] = await generateEmbeddings(texts);
  if (!Array.isArray(embeddedTexts)) {
    throw new Error("generateEmbeddings did not return an array");
  }
  console.log(`--- Generated ${embeddedTexts.length} embeddings ---`);

  console.log(`--- Preparing ${embeddedTexts.length} vectors for upsert... ---`);
  const vectors: PineconeVector[] = embeddedTexts.map((embedding: number[], i: number) => ({
    id: `${docId}-${i}`,
    values: embedding,
    metadata: { text: texts[i] },
  }));

  console.log(`--- Upserting ${vectors.length} vectors into Pinecone namespace ${docId}... ---`);
  await index.namespace(docId).upsert(vectors);
  console.log(`--- Successfully stored ${vectors.length} embeddings in Pinecone ---`);
 
}





export const generateLangchainCompletion = async (docId: string, question: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  console.log("--- Ensuring embeddings are generated... ---");
  await generateEmbeddingsInPineconeVectorStore(docId);

  console.log("--- Initializing PineconeStore... ---");
  const index = await pineconeClient.index(indexName);
  const pineconeVectorStore = await PineconeStore.fromExistingIndex(
    new CustomEmbeddings(),
    {
      pineconeIndex: index,
      namespace: docId,
      textKey: "text",
    }
  );

  console.log("--- Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever();

  console.log("--- Fetching chat history... ---");
  const chatHistory = await fetchMessagesFromDB(docId);
  const historyText = chatHistory.map((msg) => `${msg._getType()}: ${msg.content}`).join("\n");

  console.log("--- Retrieving relevant documents... ---");
  const relevantDocs = await retriever.invoke(question);
  const context = relevantDocs.map((doc) => doc.pageContent).join("\n");

  console.log("--- Generating answer with distilgpt2... ---");
  const prompt = `Based on the following context and chat history, answer the question:\n\nContext:\n${context}\n\nChat History:\n${historyText}\n\nQuestion: ${question}\nAnswer:`;
  const answer = await generateText(prompt, 100);

  console.log("--- Generated answer:", answer);
  return answer;
};

