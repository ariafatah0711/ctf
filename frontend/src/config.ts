// src/config.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const FLAG_FORMAT = "CWA{FLAG}";

export default {
  BASE_URL, FLAG_FORMAT
};