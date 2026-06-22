import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle unauthorized errors (e.g. token expired)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    
    // Extract backend API response error message if available
    const data = error.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      return Promise.reject(new Error(data.message));
    }
    
    return Promise.reject(error);
  }
);
