// backend\pages\api\challenges\[id].js
import supabase from "../../../lib/supabase";
import { verifyToken, requireRole } from "../../../lib/middleware/auth";
import { encrypt } from "../../../lib/encrypt";
import { validate as validateUUID } from "uuid"; // Import validate dari uuid package

// Fungsi untuk memvalidasi UUID
const isUUID = (str) => {
  return validateUUID(str); // Gunakan validate dari uuid package
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query; // Ambil ID dari parameter URL

  console.log("Received ID:", id); // Log ID untuk melihat apa yang diterima

  // Validasi apakah ID valid
  if (!id || typeof id !== "string" || id.length === 0) {
    return res.status(400).json({ message: "ID tidak valid." });
  }

  // Jika menggunakan UUID, validasi format UUID
  if (!isUUID(id)) {
    return res.status(400).json({ message: "ID tidak dalam format UUID yang valid." });
  }

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("id, title, description, difficulty, created_at, url, tags")
        .eq("id", id)
        .single();

      if (error) return res.status(500).json({ message: error.message });
      if (!data) return res.status(404).json({ message: "Challenge tidak ditemukan." });

      return res.status(200).json({ data });
    });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    verifyToken(req, res, async () => {
      // requireRole("admin")(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        // const { title, description, difficulty, flag } = req.body;
        const { title, description, difficulty, flag, url, tags, hint } = req.body;

        // Validasi input
        if (!title || !description || !difficulty || !flag || !url) {
          return res.status(400).json({ message: "Semua field harus diisi." });
        }

        if (typeof difficulty !== "number") {
          return res.status(400).json({ message: "Difficulty harus berupa angka." });
        }

        // Validasi tags (boleh kosong atau array of strings)
        if (tags && !Array.isArray(tags)) {
          return res.status(400).json({ message: "Tags harus berupa array." });
        }

        // Validasi hint (boleh kosong)
        if (hint && typeof hint !== "string") {
          return res.status(400).json({ message: "Hint harus berupa string." });
        }

        // Cek apakah challenge dengan ID ini ada
        const { data: existingChallenge, error: findError } = await supabase
          .from("challenges")
          .select("id")
          .eq("id", id)
          .single();

        if (findError) {
          return res.status(500).json({ message: findError.message });
        }

        if (!existingChallenge) {
          return res.status(404).json({ message: "Challenge tidak ditemukan." });
        }

        const encryptedFlag = encrypt(flag);

        // Update challenge di database Supabase
        const { data, error } = await supabase
          .from("challenges")
          .update({ title, description, difficulty, flag: encryptedFlag, url, tags, hint })
          .eq("id", id)
          .select("*"); // Select agar return data yang baru diupdate

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.status(200).json({ message: "Challenge berhasil diperbarui!", data });
      });
    });
  } else if (req.method === "DELETE") {
    verifyToken(req, res, async () => {
      // requireRole("admin")(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        // Cek apakah challenge dengan ID ini ada
        const { data: existingChallenge, error: findError } = await supabase
          .from("challenges")
          .select("id")
          .eq("id", id)
          .single();

        if (findError) {
          return res.status(500).json({ message: findError.message });
        }

        if (!existingChallenge) {
          return res.status(404).json({ message: "Challenge tidak ditemukan." });
        }

        // Hapus challenge dari database Supabase
        const { data, error } = await supabase.from("challenges").delete().eq("id", id);

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.status(200).json({ message: "Challenge berhasil dihapus.", data });
      });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
