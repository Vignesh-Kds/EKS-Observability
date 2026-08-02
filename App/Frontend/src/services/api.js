import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized request");
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
