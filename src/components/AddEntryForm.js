import React, { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddEntryForm = ({ userId, fetchEntries }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("adding entry...");
      await addDoc(collection(db, "entries"), {
        userId,
        title,
        content,
        createdAt: new Date().toISOString(),
      });
      console.log("Entury Added Successfhully!!");
      setTitle("");
      setContent("");
      fetchEntries();
      alert("Entry added successfully!");
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto w-full px-4 md:px-0"
    >
      {/* ADD ENTRY FORM */}
      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
      />

      {/* Content Textarea */}
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none h-48 resize-none text-lg"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
      >
        Add Entry
      </button>
    </form>
  );
};

export default AddEntryForm;
