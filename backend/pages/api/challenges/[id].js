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

  if (req.method === "PUT" || req.method === "PATCH") {
    verifyToken(req, res, async () => {
      // requireRole("admin")(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { title, description, difficulty, flag } = req.body;

        // Validasi input
        if (!title || !description || !difficulty || !flag) {
          return res.status(400).json({ message: "Semua field harus diisi." });
        }

        if (typeof difficulty !== "number") {
          return res.status(400).json({ message: "Difficulty harus berupa angka." });
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
          .update({ title, description, difficulty, flag: encryptedFlag })
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
