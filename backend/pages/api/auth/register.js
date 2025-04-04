// /backend/pages/api/auth/register.js
import { hash } from "bcryptjs";
import supabase from "../../../lib/supabase"; // Pastikan import sudah benar

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password harus diisi." });
    }

    try {
      // Cek apakah email atau username sudah terdaftar
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .or(`email.eq.${email},username.eq.${username}`)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error(checkError.message);
      }

      if (existingUser) {
        return res.status(400).json({ message: "Email atau username sudah digunakan." });
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Insert ke tabel users di Supabase
      const { data, error } = await supabase.from("users").insert([{ username, email, password: hashedPassword }]);

      if (error) {
        throw new Error(error.message);
      }

      return res.status(201).json({ message: "User berhasil didaftarkan", data });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
