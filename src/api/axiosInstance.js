//src/api/axiosInstance
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Update to match your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
