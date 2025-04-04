// /pages/lib/encrypt.js
import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // dari .env

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(encrypted) {
  const [ivHex, encHex] = encrypted.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(ivHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}

function hashFlag(flag) {
  return crypto.createHash("sha256").update(flag).digest("hex");
}

export { encrypt, decrypt, hashFlag };
