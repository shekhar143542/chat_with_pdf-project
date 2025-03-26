// import { pipeline } from "@xenova/transformers";

// let embedder: any = null;

// // Load the embedding model (cached for efficiency)
// async function getEmbedder() {
//   if (!embedder) {
//     console.log("--- Loading all-MiniLM-L6-v2 model (first-time only)... ---");
//     embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//   }
//   return embedder;
// }

// // Function to generate embeddings for an array of texts
// export async function generateEmbeddings(texts: string[]) {
//   if (!texts || texts.length === 0) {
//     throw new Error("No texts provided for embedding generation.");
//   }

//   try {
//     const embedder = await getEmbedder();
//     const embeddings = await embedder(texts, { pooling: "mean", normalize: true });
//     return embeddings.tolist(); // Convert tensor to list
//   } catch (error) {
//     console.error("Error generating embeddings:", error);
//     throw error;
//   }
// }


import { pipeline } from "@xenova/transformers";
import Groq from "groq-sdk";

let embedder: any = null;
let groq: Groq | null = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("--- Loading all-MiniLM-L6-v2 model (first-time only)... ---");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function generateEmbeddings(texts: string[]) {
  try {
    if (!texts || texts.length === 0) {
      throw new Error("No texts provided for embedding generation.");
    }

    const embedder = await getEmbedder();
    const embeddings = await embedder(texts, { pooling: "mean", normalize: true });
    return embeddings.tolist();
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

async function getGroqClient() {
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in the environment variables.");
    }
    groq = new Groq({ apiKey });
  }
  return groq;
}

export async function generateText(prompt: string, maxLength: number = 50) {
  try {
    if (!prompt) {
      throw new Error("No prompt provided for text generation.");
    }

    const groq = await getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: maxLength,
      temperature: 0.7,
      top_p: 0.95,
    });

    console.log("Completion response:", JSON.stringify(completion, null, 2));

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message || !completion.choices[0].message.content) {
      throw new Error("Unexpected response structure from Groq API");
    }

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating text with Llama 3:", error);
    throw error;
  }
}