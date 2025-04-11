import CryptoJS from 'crypto-js';
import config from "../config/env"

const SECRET_KEY = config.PASSWORD_REMEMBER_ME_LOGIN; // Simpan ini aman!

export function encryptAuthData(email: string, password: string): string {
  const data = JSON.stringify({ email, password });
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decryptAuthData(ciphertext: string): { email: string; password: string } | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export function encryptUserData(user: any): string {
  const data = JSON.stringify(user);
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decryptUserData(ciphertext: string): any | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}