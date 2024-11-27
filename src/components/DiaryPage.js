//src/components/DiaryPage
import React, { useCallback, useEffect, useState } from "react";
import AddEntryForm from "./AddEntryForm";
import DiaryEntriesList from "./DiaryEntriesList";

const DiaryPage = ({ userId, onEntriesUpdate }) => {
  const [entries, setEntries] = useState([]);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);
  const [isTasksInProgressExpanded, setIsTasksInProgressExpanded] =
    useState(false);
  const [isCompletedTasksExpanded, setIsCompletedTasksExpanded] =
    useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch("/api/entries");
      const data = await response.json();
      setEntries(data); // Local state update
      onEntriesUpdate(data); // Pass entries up to App.js
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  }, [onEntriesUpdate]);

  useEffect(() => {
    fetchEntries(); // Fetch entries when the component mounts
  }, [fetchEntries]);

  const toggleReminders = () => {
    setIsRemindersExpanded(!isRemindersExpanded);
  };

  const toggleTasksInProgress = () => {
    setIsTasksInProgressExpanded(!isTasksInProgressExpanded);
  };

  const toggleCompletedTasks = () => {
    setIsCompletedTasksExpanded(!isCompletedTasksExpanded);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-6 py-4 h-screen bg-gray-100">
      {/* Left Column: Add Entry Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <AddEntryForm userId={userId} fetchEntries={fetchEntries} />
        </div>
      </div>

      {/* Right Column: Grouped Entries */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Upcoming Reminders */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Reminders
          </h2>
          <button
            onClick={toggleReminders}
            className="text-blue-500 hover:text-blue-700 font-medium mb-2"
          >
            {isRemindersExpanded ? "Show Less" : "Show All"}
          </button>
          <DiaryEntriesList
            type="reminders"
            isExpanded={isRemindersExpanded}
            entries={entries}
          />
        </div>

        {/* Tasks in Progress */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Tasks in Progress
          </h2>
          <button
            onClick={toggleTasksInProgress}
            className="text-blue-500 hover:text-blue-700 font-medium mb-2"
          >
            {isTasksInProgressExpanded ? "Show Less" : "Show All"}
          </button>
          <DiaryEntriesList
            type="tasks-in-progress"
            isExpanded={isTasksInProgressExpanded}
            entries={entries}
          />
        </div>

        {/* Completed Tasks */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Completed Tasks
          </h2>
          <button
            onClick={toggleCompletedTasks}
            className="text-blue-500 hover:text-blue-700 font-medium mb-2"
          >
            {isCompletedTasksExpanded ? "Show Less" : "Show All"}
          </button>
          <DiaryEntriesList
            type="completed-tasks"
            isExpanded={isCompletedTasksExpanded}
            entries={entries}
          />
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
