const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const DEFAULT_API = isLocal
  ? "http://localhost:8080/api"
  : "https://farmer360-backend.onrender.com/api";

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API).replace(/\/+$/, "");
export const BASE_URL = API_URL.replace(/\/api$/, "");

export const img = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return BASE_URL + path;
};
