"use server";

import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

const FREE_LIMIT = 20;
const PRO_LIMIT = 150;

export async function askQuestion({ id, question }: { id: string; question: string }) {
  try {
    // Validate input
    if (!id || !question) {
      return { success: false, message: "Missing id or question" };
    }

    // Authenticate the user with Clerk
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Reference to the user's chat history in Firestore
    const chatRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(id)
      .collection("chat");

    // Check message limit
    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter((doc) => doc.data().role === "human");
    if (userMessages.length >= FREE_LIMIT) {
      return { success: false, message: "Free message limit reached" };
    }

    // Add the user's message to Firestore
    const userMessage = {
      role: "human",
      message: question,
      createdAt: new Date(),
    };
    await chatRef.add(userMessage);

    // Generate AI response
    const reply = await generateLangchainCompletion(id, question);

    // Add the AI's response to Firestore
    const aiMessage = {
      role: "ai",
      message: reply,
      createdAt: new Date(),
    };
    await chatRef.add(aiMessage);

    // Return the AI response
    return { success: true, message: reply };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in askQuestion:", errorMessage);
    if (errorMessage.includes("ClerkJS: Network error")) {
      return { success: false, message: "Authentication failed due to a network error. Please try again." };
    }
    return { success: false, message: `Error: ${errorMessage}` };
  }
}