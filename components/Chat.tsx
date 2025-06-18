"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2Icon, BotIcon } from "lucide-react"; // AI icon
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { askQuestion } from "@/actions/askQuestion";

export type Message = {
  id: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
  loading?: boolean;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [snapshot, loading] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!snapshot) return;

    const newMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      role: doc.data().role,
      message: doc.data().message,
      createdAt: doc.data().createdAt.toDate(),
    })) as Message[];

    setMessages(newMessages);
  }, [snapshot]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: `human-${Date.now()}`,
        role: "human",
        message: q,
        createdAt: new Date(),
      },
      {
        id: `ai-placeholder-${Date.now()}`,
        role: "ai",
        message: "",
        createdAt: new Date(),
        loading: true, // Show animated effect while generating response
      },
    ]);

    startTransition(async () => {
      try {
        const data = await askQuestion({ id, question: q });

        const { success, message } = data;

        setMessages((prev) => {
          const updatedMessages = prev.slice(0, prev.length - 1);

          if (success) {
            let index = 0;
            let generatedText = "";

            const interval = setInterval(() => {
              if (index < message.length) {
                generatedText += message[index];
                setMessages([
                  ...updatedMessages,
                  {
                    id: `ai-${Date.now()}`,
                    role: "ai",
                    message: generatedText + "█", // Typing effect
                    createdAt: new Date(),
                  },
                ]);
                index++;
              } else {
                clearInterval(interval);
                setMessages([
                  ...updatedMessages,
                  {
                    id: `ai-${Date.now()}`,
                    role: "ai",
                    message: generatedText,
                    createdAt: new Date(),
                  },
                ]);
              }
            }, 20);
            return updatedMessages;
          } else {
            return [
              ...updatedMessages,
              {
                id: `ai-error-${Date.now()}`,
                role: "ai",
                message: `Whoops... ${message}`,
                createdAt: new Date(),
              },
            ];
          }
        });
      } catch (error) {
        console.error("Error calling askQuestion:", error);
        setMessages((prev) => [
          ...prev.slice(0, prev.length - 1),
          {
            id: `ai-error-${Date.now()}`,
            role: "ai",
            message: "Whoops... Failed to fetch response",
            createdAt: new Date(),
          },
        ]);
      }
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full justify-center items-center bg-gray-900 text-white">
        <p className="text-gray-400">Please sign in to chat with the PDF.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full justify-center items-center bg-gray-900 text-white">
        <Loader2Icon className="animate-spin h-10 w-10 text-indigo-500" />
        <p className="text-gray-400 mt-2">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 w-full overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full justify-center items-center">
            <p className="text-gray-400">No messages yet. Ask a question to start!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 my-2 flex items-center gap-2 ${
                message.role === "human" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI Avatar (left side for AI messages) */}
              {message.role === "ai" && (
                <div className="w-9 h-9 bg-gray-800 flex justify-center items-center rounded-full shadow-md">
                  <BotIcon className="text-gray-400 w-6 h-6" />
                </div>
              )}

              {/* Message Bubble */}
              <span
                className={`inline-block px-4 py-2 rounded-lg text-white text-sm shadow-lg ${
                  message.role === "human"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                    : "bg-gray-700"
                }`}
              >
                {message.loading ? (
                  <div className="flex space-x-1">
                    <span className="animate-bounce w-2 h-2 bg-white rounded-full"></span>
                    <span className="animate-bounce w-2 h-2 bg-white rounded-full delay-200"></span>
                    <span className="animate-bounce w-2 h-2 bg-white rounded-full delay-400"></span>
                  </div>
                ) : (
                  message.message
                )}
              </span>

              {/* User Avatar (right side for human messages) */}
              {message.role === "human" && user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-500 shadow-md"
                />
              )}
            </div>
          ))
        )}
        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-4 bg-gray-800 border-t border-gray-700 shadow-md"
      >
        <Input
          className="flex-1 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ask a Question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition duration-300 ease-in-out"
          type="submit"
          disabled={!input || isPending}
        >
          {isPending ? <Loader2Icon className="animate-spin text-white" /> : "Ask"}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
