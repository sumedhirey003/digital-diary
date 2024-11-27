//src/components/DiaryEntriesList
import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const formatDate = (timestamp) => {
  if (!timestamp) return "Invalid Date";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date instanceof Date && !isNaN(date)
    ? date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Invalid Date";
};

const DiaryEntriesList = ({ userId, type, refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTaskStatus, setEditedTaskStatus] = useState("");
  const [editedReminderDateTime, setEditedReminderDateTime] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetching diary entries from Firebase
  const fetchEntries = useCallback(async () => {
    try {
      if (!userId) {
        setError("User ID is missing.");
        return;
      }
      const response = await axiosInstance.get(`/entries?userId=${userId}`);
      const sortedEntries = response.data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : 0;
        const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : 0;
        return dateB - dateA;
      });

      sortedEntries.forEach((entry) => {
        if (entry.reminderDateTime && entry.reminderDateTime._seconds) {
          entry.reminderDateTime = new Date(
            entry.reminderDateTime._seconds * 1000
          );
        } else {
          entry.reminderDateTime = null;
        }
      });

      setEntries(sortedEntries);
    } catch (err) {
      setError("Error fetching entries: " + err.message);
    }
  }, [userId]);

  // UseEffect to fetch entries on initial load and refresh
  useEffect(() => {
    fetchEntries();
  }, [userId, refreshTrigger, fetchEntries]);

  const filterEntries = (entries, type) => {
    const now = new Date();
    switch (type) {
      case "upcomingReminders":
        return entries.filter(
          (entry) =>
            entry.reminderDateTime && new Date(entry.reminderDateTime) > now
        );
      case "tasksInProgress":
        return entries.filter(
          (entry) => entry.isTask && entry.taskStatus === "In Progress"
        );
      case "completedTasks":
        return entries.filter(
          (entry) => entry.isTask && entry.taskStatus === "Completed"
        );
      default:
        return entries; // Default: return all entries
    }
  };
  // Applying filter based on the type prop

  //grouiping the entries of task,reminder and completed task
  const groupEntries = (entries) => {
    const now = new Date();

    const filteredEntries = filterEntries(entries, type);

    return filteredEntries.reduce(
      (groups, entry) => {
        const { reminderDateTime, isTask, taskStatus } = entry;

        if (reminderDateTime && new Date(reminderDateTime) > now) {
          groups.upcomingReminders.push(entry);
        } else if (isTask && taskStatus === "In Progress") {
          groups.tasksInProgress.push(entry);
        } else if (isTask && taskStatus === "Completed") {
          groups.completedTasks.push(entry);
        } else {
          groups.otherEntries.push(entry);
        }

        return groups;
      },
      {
        upcomingReminders: [],
        tasksInProgress: [],
        completedTasks: [],
        otherEntries: [],
      }
    );
  };

  // Group the entries
  const groupedEntries = groupEntries(entries);

  //handlling delete function
  const handleDelete = async (entryId) => {
    try {
      await axiosInstance.delete(`/entries/${entryId}`);
      console.log("Entry Deleted!!");
      setEntries(entries.filter((entry) => entry.id !== entryId));
    } catch (err) {
      setError("Error deleting the entry: " + err.message);
    }
  };

  // //handling the edit function
  // const handleEdit = (entry) => {
  //   setEditEntryId(entry.id);
  //   setEditedTitle(entry.title);
  //   setEditedContent(entry.content);
  //   setEditedTaskStatus(entry.taskStatus || "");
  //   setEditedReminderDateTime(
  //     entry.reminderDateTime ? new Date(entry.reminderDateTime) : null
  //   );
  // };

  //handling update
  const handleUpdate = async (entryId) => {
    try {
      const updatedEntry = {
        title: editedTitle,
        content: editedContent,
        taskStatus: editedTaskStatus,
        reminderDateTime: editedReminderDateTime
          ? editedReminderDateTime.toISOString()
          : null,
      };
      await axiosInstance.patch(`/entries/${entryId}`, updatedEntry);
      console.log("Entry updated");
      setEditEntryId(null); // Reset edit mode
      setEntries(
        entries.map((entry) =>
          entry.id === entryId ? { ...entry, ...updatedEntry } : entry
        )
      );
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

      {/* Dynamically render groups */}
      {Object.entries(groupedEntries).map(([groupName, groupEntries]) => {
        const groupLabel = groupName.replace(/([A-Z])/g, " $1"); // Convert camelCase to readable format
        const showAll = isExpanded || groupEntries.length <= 2;

        return (
          <div key={groupName} className="space-y-6">
            <h3 className="text-xl font-bold text-green-700 capitalize">
              {groupLabel}
            </h3>

            {groupEntries.length === 0 ? (
              <p className="text-gray-500 italic">
                No entries in this category
              </p>
            ) : (
              <>
                {(showAll ? groupEntries : groupEntries.slice(0, 2)).map(
                  (entry) => (
                    <div
                      key={entry.id}
                      className="bg-white p-6 rounded-lg shadow-lg space-y-4"
                    >
                      {editEntryId === entry.id ? (
                        <div className="space-y-4">
                          {/* Edit Mode */}
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
                          <select
                            value={editedTaskStatus}
                            onChange={(e) =>
                              setEditedTaskStatus(e.target.value)
                            }
                            className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
                          >
                            <option value="">Select Task Status</option>
                            {["Not Started", "In Progress", "Completed"].map(
                              (status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                          <input
                            type="datetime-local"
                            value={
                              editedReminderDateTime
                                ? editedReminderDateTime
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) =>
                              setEditedReminderDateTime(
                                new Date(e.target.value)
                              )
                            }
                            className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
                          />
                          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                              onClick={() => handleUpdate(entry.id)}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                setEditEntryId(null);
                                setEditedTitle("");
                                setEditedContent("");
                                setEditedTaskStatus("");
                                setEditedReminderDateTime(null);
                              }}
                              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Display Mode */}
                          <h4 className="text-xl font-semibold text-gray-800">
                            {entry.title}
                          </h4>
                          <p className="text-gray-600">{entry.content}</p>
                          <p className="text-sm text-gray-500">
                            Created on: {formatDate(entry.createdAt)}
                          </p>
                          {entry.taskStatus && (
                            <p className="text-gray-500">
                              Status: {entry.taskStatus}
                            </p>
                          )}
                          {entry.reminderDateTime ? (
                            <p className="text-gray-500">
                              Reminder: {formatDate(entry.reminderDateTime)}
                            </p>
                          ) : (
                            <p className="text-gray-500">Reminder: Not set</p>
                          )}
                          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                              onClick={() => {
                                setEditEntryId(entry.id);
                                setEditedTitle(entry.title);
                                setEditedContent(entry.content);
                                setEditedTaskStatus(entry.taskStatus || "");
                                setEditedReminderDateTime(
                                  entry.reminderDateTime
                                    ? new Date(entry.reminderDateTime)
                                    : null
                                );
                              }}
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
                  )
                )}

                {/* Expand/Collapse Button */}
                {groupEntries.length > 2 && (
                  <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiaryEntriesList;
