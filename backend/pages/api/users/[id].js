// /backend/pages/api/users/[id].js
import { hash } from "bcryptjs";
import supabase from "../../../lib/supabase";
import { verifyToken, requireRole } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;
  const { id } = req.query; // Mendapatkan ID dari URL parameter

  if (req.method === "GET") {
    try {
      verifyToken(req, res, async () => {
        // Ambil data user berdasarkan ID, kecuali password
        const { data, error } = await supabase.from("users").select("id, username").eq("id", id).single(); // Gunakan `.single()` agar hanya ambil satu data

        if (error) {
          return res.status(404).json({ message: "User tidak ditemukan.", error: error.message });
        }

        return res.status(200).json({ message: "Data user berhasil diambil.", data });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  }

  // Cek apakah request menggunakan metode PUT
  else if (method === "PUT") {
    const { username, password, role } = req.body;

    // Verifikasi token dan pastikan role admin
    verifyToken(req, res, async () => {
      requireRole("admin")(req, res, async () => {
        // Validasi input
        if (!username && !password && !role) {
          return res.status(400).json({ message: "Username, password, atau role harus disertakan." });
        }

        try {
          // Ambil data user yang akan diubah berdasarkan ID
          const { data: existingUser, error: fetchError } = await supabase.from("users").select("*").eq("id", id).single();

          if (fetchError) {
            return res.status(404).json({ message: "User tidak ditemukan." });
            // return res.status(500).json({ message: "Gagal mengupdate user.", error: updateError.message });
          }

          // Update username jika ada
          const updatedUser = { ...existingUser };
          if (username) {
            updatedUser.username = username;
          }

          // Update password jika ada dan melakukan hash
          if (password) {
            updatedUser.password = await hash(password, 10);
          }

          // Update role jika ada
          if (role) {
            updatedUser.role = role;
          }

          // Melakukan update data ke Supabase
          const { data, error: updateError } = await supabase.from("users").update(updatedUser).eq("id", id);

          if (updateError) {
            return res.status(500).json({ message: "Gagal mengupdate user.", error: updateError.message });
          }

          return res.status(200).json({ message: "User berhasil diperbarui.", data });
        } catch (error) {
          return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
        }
      });
    });
  }

  // Cek apakah request menggunakan metode DELETE
  else if (method === "DELETE") {
    // Verifikasi token dan pastikan role admin
    verifyToken(req, res, async () => {
      requireRole("admin")(req, res, async () => {
        try {
          // Ambil data user yang akan dihapus berdasarkan ID
          const { data: existingUser, error: fetchError } = await supabase.from("users").select("*").eq("id", id).single();

          if (fetchError) {
            return res.status(404).json({ message: "User tidak ditemukan." });
          }

          // Melakukan delete data user
          const { error: deleteError } = await supabase.from("users").delete().eq("id", id);

          if (deleteError) {
            return res.status(500).json({ message: "Gagal menghapus user.", error: deleteError.message });
          }

          return res.status(200).json({ message: "User berhasil dihapus." });
        } catch (error) {
          return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
        }
      });
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
