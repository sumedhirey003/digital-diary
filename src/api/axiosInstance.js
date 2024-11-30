//src/api/axiosInstance
import axios from "axios";
import { getAuth, getIdToken } from "firebase/auth";

const axiosInstance = axios.create({
  baseURL: "https://digital-diary-two.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Attempt to get the current Firebase user and their token
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Get the ID token dynamically
        const token = await getIdToken(currentUser);

        console.log("Firebase Token retrieved:", token ? "Yes" : "No");

        if (token) {
          // Set the Authorization header with the Firebase ID token
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Fallback to localStorage token if no current Firebase user
        const localStorageToken = localStorage.getItem("authToken");

        if (localStorageToken) {
          console.log("Falling back to localStorage token");
          config.headers.Authorization = `Bearer ${localStorageToken}`;
        }
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response) {
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      if (error.response.status === 401) {
        // Redirect to login or clear authentication
        console.warn("Unauthorized - redirecting to login");
        // Example: history.push('/login');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
