//src/components/AddEntryForm.js
import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEntryForm = ({ userId, fetchEntries }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState(null);
  const [isTask, setIsTask] = useState(false);
  const [taskStatus, setTaskStatus] = useState("Not Started Yet");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("adding entry...");
      //calling backend here:

      const response = await axiosInstance.post("/entries", {
        userId,
        title,
        content,
        reminderDateTime: reminderDateTime
          ? reminderDateTime.toISOString()
          : null,
        isTask,
        taskStatus,
        //createdAt: new Date().toISOString(),
      });
      console.log("Entry Added Successfully!!", response.data);
      setTitle("");
      setContent("");
      setReminderDateTime(null);
      setIsTask(false);
      setTaskStatus("Not Started Yet");

      fetchEntries();
      alert("Entry added successfully!");
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  };

  const displayReminderDate = reminderDateTime
    ? new Date(reminderDateTime).toLocaleString()
    : "No Reminder Set";

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
      <div>
        <label className="block text-gray-700 font-medium  mb-2">
          Set A Reminder
        </label>
        <DatePicker
          selected={reminderDateTime}
          onChange={(date) => setReminderDateTime(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select Date & Time"
          className="w=full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
        />
        {/* Display reminder date */}
        <div className="mt-2 text-gray-700">
          <strong>Reminder: </strong>
          {displayReminderDate}
        </div>
      </div>
      {/* Is Task Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isTask}
          onChange={(e) => setIsTask(e.target.checked)}
          id="isTask"
          className="h-5 w-5 text-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isTask" className="text-gray-700">
          Mark as Task
        </label>
      </div>

      {/* Task Status Dropdown */}
      {isTask && (
        <div>
          <label className="block text-gray-700 font-medium  mb-2">
            Task Status
          </label>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="w-full p-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-lg"
          >
            <option value="Not Started Yet">Not Started Yet</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

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
