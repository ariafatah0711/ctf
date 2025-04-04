// /backend/pages/api/users/index.js
import supabase from "../../../lib/supabase"; // Pastikan import sudah benar
import { verifyToken } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      verifyToken(req, res, async () => {
        // Ambil semua data pengguna, kecuali password
        const { data, error } = await supabase.from("users").select("id, username"); // Pilih kolom yang ingin ditampilkan, tanpa password

        if (error) {
          return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pengguna.", error: error.message });
        }

        // Jika data ditemukan, kembalikan data pengguna
        return res.status(200).json({ message: "Data pengguna berhasil diambil.", data });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
