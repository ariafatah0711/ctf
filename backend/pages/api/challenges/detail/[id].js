import supabase from "@/lib/supabase";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { validate as validateUUID } from "uuid";
import { decrypt } from "@/lib/encrypt"; // ⬅️ tambahkan ini

const isUUID = (str) => validateUUID(str);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== "string" || !isUUID(id)) {
    return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
  }

  if (req.method === "GET") {
    return verifyToken(req, res, () =>
      requireRole(["admin", "maker"])(req, res, async () => {
        const { data, error } = await supabase.from("challenges").select("*").eq("id", id).single();

        if (error) return res.status(500).json({ message: error.message });
        if (!data) return res.status(404).json({ message: "Challenge tidak ditemukan." });

        // 🔓 Decrypt flag sebelum dikirim ke frontend
        const decryptedFlag = decrypt(data.flag);
        data.flag = decryptedFlag;

        return res.status(200).json({ data });
      })
    );
  }

  return res.status(405).json({ message: "Method tidak diizinkan." });
}
