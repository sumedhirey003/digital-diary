//src/api/axiosInstance
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://digital-diary-two.vercel.app/api", // Update to match your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
