import axios from "axios";

const API_URL = import.meta.env.VITE_API || "/";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization header for admin requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const verifyToken = (phoneNumber, token) =>
  api.post("/auth/verify", { phoneNumber, token });
export const adminLogin = (username, password) =>
  api.post("/auth/admin/login", { username, password });

// Form services
export const getFormFields = () => api.get("/api/forms/fields");
export const createFormField = (fieldData) =>
  api.post("/api/forms/fields", fieldData);
export const updateFormField = (id, fieldData) =>
  api.put(`/api/forms/fields/${id}`, fieldData);
export const deleteFormField = (id) => api.delete(`/api/forms/fields/${id}`);
export const submitForm = (formData) => api.post("/api/forms/submit", formData);
export const getFormSubmissions = () => api.get("/api/forms/submissions");

export default api;
