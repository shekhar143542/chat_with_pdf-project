'use server'
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";

export async function generateEmbeddings(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized"); // Handle unauthorized access
    }

    // Proceed with embeddings generation if authenticated
    console.log(`Generating embeddings for docId: ${docId}`);

    //turn a pdf into embeddings
    await generateEmbeddingsInPineconeVectorStore(docId);

    revalidatePath('/dashboard');

    return {completed: true};
}
