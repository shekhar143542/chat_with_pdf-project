"use client";

import React from "react";
import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { FileTextIcon, Trash2Icon } from "lucide-react"; // Added Trash2Icon for delete
import { deleteDoc, doc } from "firebase/firestore"; // Firestore delete
import { ref, deleteObject } from "firebase/storage"; // Firebase Storage delete
import { db, storage } from "@/firebase"; // Adjust path to your Firebase config


const Document = ({
  id,
  name,
  size,
  // downloadUrl,
  onDelete, // New prop for UI update
}: {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
  onDelete?: (id: string) => void; // Callback to update parent state
}) => {
  const router = useRouter();

  // Handle delete action
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      // 1. Delete from Firebase Storage
      const storageRef = ref(storage, `files/${id}`); // Adjust path as per your storage structure
      await deleteObject(storageRef);

      // 2. Delete from Firestore
      const docRef = doc(db, "documents", id); // Adjust collection name if different
      await deleteDoc(docRef);

      // 3. Update UI immediately via callback
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the file. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col w-64 h-80 rounded-xl bg-white shadow-lg border border-gray-200 
      hover:shadow-2xl hover:border-indigo-500 transition-all transform hover:scale-105 
      cursor-pointer group overflow-hidden relative" // Added relative for positioning
      onClick={() => router.push(`/dashboard/files/${id}`)}
    >
      {/* File Icon */}
      <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm m-5">
        <FileTextIcon className="w-8 h-8" />
      </div>

      {/* File Name */}
      <p className="text-lg font-semibold text-gray-900 px-5 line-clamp-2 group-hover:text-indigo-600 transition">
        {name}
      </p>

      {/* File Size */}
      <p className="text-sm text-gray-500 px-5 mt-2 group-hover:text-indigo-400 transition">
        {byteSize(size).toString()}
      </p>

      {/* Delete Button (Visible on Hover) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full 
        opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
        title="Delete file"
      >
        <Trash2Icon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Document;