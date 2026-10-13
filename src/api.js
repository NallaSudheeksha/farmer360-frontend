import axios from "axios";
import { API_URL, BASE_URL } from "./config";

// Paata code (MyCrops.jsx etc.) "BASE" import chestundi, so daanini keep chestunnam
export const BASE = BASE_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;