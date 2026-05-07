import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const username = localStorage.getItem("username") || "admin";
  const password = localStorage.getItem("password") || "admin123";

  config.auth = {
    username,
    password,
  };

  return config;
});

export default apiClient;