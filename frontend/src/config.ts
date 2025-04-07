// src/config.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const FLAG_FORMAT = import.meta.env.VITE_FLAG_FORMAT || "CWA{FLAG}";
const PASSWORD_REMEMBER_ME_LOGIN = import.meta.env.VITE_PASSWORD_REMEMBER_ME_LOGIN || "secret123"

export default {
  BASE_URL, FLAG_FORMAT, PASSWORD_REMEMBER_ME_LOGIN
};