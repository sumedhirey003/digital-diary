import React, { useEffect, useState, useCallback } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import AddEntryForm from "../components/AddEntryForm";
import DiaryEntriesList from "../components/DiaryEntriesList";
import axiosInstance from "../api/axiosInstance";
import { Book } from "lucide-react";

const DashboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEntries = useCallback(async () => {
    console.log(`[Dashboard] Fetching entries for userId: ${userId}`);

    if (!userId) {
      console.error("❌ No userId available");
      setLoading(false);
      return;
    }

    try {
      console.log(`Attempting to fetch entries for userId: ${userId}`);

      const user = getAuth().currentUser;

      if (!user) {
        console.error("No authenticated user found");
        setError("Please Log in to view your entries");
        setLoading(false);
        return;
      }

      let token;
      try {
        token = await user.getIdToken();
      } catch (err) {
        console.error("Error fetching Firebase token:", err);
        setError("Failed to authenticate. Please try logging in agian.");
        setLoading(false);
        return;
      }
      console.log("Fetched Firebase token:", token);

      const response = await axiosInstance.get(`/entries?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ API Response Data:", response.data);

      setEntries(response.data);
      setError(null);
    } catch (err) {
      console.error("[Dashboard] Fetch Entries Error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Authenticated user:", user);
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
        setLoading(false);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchEntries();
    }
  }, [userId, fetchEntries]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  if (loading) return <div>Loading..</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-purple-600 text-white p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Book className="text-white mr-2" size={32} />
          <h1 className="text-2xl font-bold">
            Welcome to your Diary! {userEmail}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* User Info */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            User Information
          </h2>
          <p className="text-gray-600">
            User ID: <span className="text-gray-800">{userId}</span>
          </p>
          <button
            onClick={fetchEntries}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Refresh Entries
          </button>
        </div>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Add Entry Section */}
          <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Add a New Entry
            </h2>
            {/* Render AddEntryForm */}
            <AddEntryForm userId={userId} fetchEntries={fetchEntries} />
          </div>

          {/* Entries List Section */}
          <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
            {/* YOUR ENTRIES */}
            {/* Render DiaryEntriesList */}
            <DiaryEntriesList entries={entries} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
