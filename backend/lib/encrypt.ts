import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY tidak ditemukan di .env");
}

const key = Buffer.from(ENCRYPTION_KEY, "hex");

/**
 * Mengenkripsi teks menggunakan AES-256-CBC
 * @param text Teks asli
 * @returns String terenkripsi dalam format `iv:encrypted`
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Mendekripsi string terenkripsi
 * @param encrypted String dalam format `iv:encrypted`
 * @returns Teks asli
 */
export function decrypt(encrypted: string): string {
  const [ivHex, encHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString("utf8");
}

/**
 * Membuat hash SHA-256 dari flag
 * @param flag String flag
 * @returns Hash hexadecimal
 */
export function hashFlag(flag: string): string {
  return crypto.createHash("sha256").update(flag).digest("hex");
}
