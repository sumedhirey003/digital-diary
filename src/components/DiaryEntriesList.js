import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Grouping entries by date

const DiaryEntriesList = ({ userId }) => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // Fetching diary entries from Firebase
  useEffect(() => {
    console.log("User Id: ", userId);
    if (!userId) {
      console.log("User Id is not setEntries.");
      return;
    }

    const q = query(collection(db, "entries"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entriesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt instanceof Timestamp
              ? doc.data().createdAt.toDate()
              : new Date(doc.data().createdAt),
        }));
        console.log("Fetched Entries:", entriesList);

        const sortedEntries = entriesList.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setEntries(sortedEntries);
      },
      (err) => {
        setError(err.message);
        console.error("Error fetching entries: ", err);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  //handlling delete function
  const handleDelete = async (entryId) => {
    try {
      await deleteDoc(doc(db, "entries", entryId));
      console.log("Entry Deleted!!");
    } catch (err) {
      setError("Error deleting the entry: " + err.message);
    }
  };

  //handling the edit function
  const handleEdit = (entry) => {
    setEditEntryId(entry.id);
    setEditedTitle(entry.title);
    setEditedContent(entry.content);
  };

  //handling update
  const handleUpdate = async (entryId) => {
    try {
      const entryRef = doc(db, "entries", entryId);
      await updateDoc(entryRef, {
        title: editedTitle,
        content: editedContent,
      });
      console.log("Entry updated");
      setEditEntryId(null); // Reset edit mode
    } catch (err) {
      setError("Error updating entry: " + err.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!entries || entries.length === 0) {
    return <p>No entries available</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Your Diary Entries
      </h2>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          {editEntryId === entry.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none h-48 resize-none text-lg"
              />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleUpdate(entry.id)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditEntryId(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xl font-semibold text-gray-800">
                {entry.title}
              </h4>
              <p className="text-gray-600">{entry.content}</p>
              <p className="text-sm text-gray-400">
                <i>{new Date(entry.createdAt).toLocaleString()}</i>
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiaryEntriesList;
