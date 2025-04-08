// src/config.ts
// secret
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const PASSWORD_REMEMBER_ME_LOGIN = import.meta.env.VITE_PASSWORD_REMEMBER_ME_LOGIN || "secret123"

// config
const FLAG_FORMAT = "CWA{FLAG}";
const VERIV_EMAIL = false

export default {
  BASE_URL, FLAG_FORMAT, PASSWORD_REMEMBER_ME_LOGIN, VERIV_EMAIL
};