import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const TestBackendConnection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/test");
        console.log("Backemd response: ", response.data);
        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data from backend.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Backend DATA</h1>
      <ul>
        {data.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.title}</strong>: {entry.content}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TestBackendConnection;
