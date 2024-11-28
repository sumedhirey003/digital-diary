//src/api/axiosInstance
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Fetch the token from localStorage
      const token = localStorage.getItem("authToken");
      console.log("Token retrieved:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach the token
      }
    } catch (error) {
      console.error("Error attaching token to request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
