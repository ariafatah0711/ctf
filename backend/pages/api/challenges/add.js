import supabase from "@/lib/supabase";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { encrypt, hashFlag } from "@/lib/encrypt";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  verifyToken(req, res, async () => {
    requireRole(["admin", "maker"])(req, res, async () => {
      console.log("Decoded user:", req.user);
      const { title, description, difficulty, flag, url, tags, hint } = req.body;

      // Validasi field wajib
      if (!title || !description || !difficulty || !flag || !url) {
        return res.status(400).json({ message: "Semua field harus diisi." });
      }

      if (typeof difficulty !== "number") {
        return res.status(400).json({ message: "Difficulty harus berupa angka." });
      }

      if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ message: "Tags harus berupa array." });
      }

      if (hint && typeof hint !== "string") {
        return res.status(400).json({ message: "Hint harus berupa string." });
      }

      const encryptedFlag = encrypt(flag);
      const flagHash = hashFlag(flag); // 🔑

      const { data, error } = await supabase
        .from("challenges")
        .insert([
          {
            title,
            description,
            difficulty,
            flag: encryptedFlag,
            flag_hash: flagHash,
            url,
            tags: tags || [],
            hint: hint || null,
          },
        ])
        .select("*");

      if (error) return res.status(500).json({ message: error.message });

      return res.status(201).json({ message: "Challenge berhasil ditambahkan!", data });
    });
  });
}
