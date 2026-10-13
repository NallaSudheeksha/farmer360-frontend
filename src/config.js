export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
export const BASE_URL = API_URL.replace(/\/api$/, "");

export const img = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return BASE_URL + path;
};