import axios from "axios";

// ✅ Base URL for the API (set via .env)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


Instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default Instance;
