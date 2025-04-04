// /pages/api/auth/login.js
import bcrypt from "bcryptjs";
import supabase from "../../../lib/supabase";
import jwt from "jsonwebtoken"; // Untuk membuat JWT

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    try {
      // Ambil data pengguna dari Supabase
      const { data: user, error } = await supabase.from("users").select("*").eq("username", username).single(); // Mengambil data pengguna berdasarkan username

      if (error || !user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Cek password yang dimasukkan dengan password yang di-hash di database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Membuat JWT token
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token valid selama 1 jam
      });

      // Kirimkan token sebagai respons
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
