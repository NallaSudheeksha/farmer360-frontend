import axios from "axios";

export const BASE = "https://farmer360-backend.onrender.com";
const api = axios.create({ baseURL: BASE + "/api" });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

// expired / invalid login -> send the user back to the login page
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.startsWith("/auth")) {
      ["token", "role", "name"].forEach((k) => localStorage.removeItem(k));
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
