import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,

  error => {
    if (axios.isAxiosError(error)) {
      console.error("========== API ERROR ==========");
      console.error("Status:", error.response?.status);
      console.error("Method:", error.config?.method?.toUpperCase());
      console.error("URL:", error.config?.url);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);
      console.log("Validation errors:", error.response?.data?.errors);
      console.error("================================");
    } else {
      console.error("Unknown error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;