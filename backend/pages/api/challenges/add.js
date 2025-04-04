// backend\pages\api\challenges\add.js
import supabase from "../../../lib/supabase";
import { encrypt, hashFlag } from "../../../lib/encrypt";
import { verifyToken, requireRole } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      // requireRole("admin")(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        // const { title, description, difficulty, flag, url } = req.body;

        // // Validasi input
        // if (!title || !description || !difficulty || !flag || !url) {
        //   return res.status(400).json({ message: "Semua field harus diisi." });
        // }

        // if (typeof difficulty !== "number") {
        //   return res.status(400).json({ message: "Difficulty harus berupa angka." });
        // }

        // const encryptedFlag = encrypt(flag);
        // const flagHash = hashFlag(flag);

        // // Insert challenge ke database Supabase
        // const { data, error } = await supabase
        //   .from("challenges")
        //   // .insert([{ title, description, difficulty, flag: encryptedFlag, url }])
        //   .insert([{ title, description, difficulty, flag: encryptedFlag, flag_hash: flagHash, url }])
        //   .select("*"); // Select biar return data yang baru dibuat

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

        const encryptedFlag = encrypt(flag);
        const flagHash = hashFlag(flag);

        // Insert challenge ke database Supabase
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
              tags: tags ? tags : [], // Menambahkan tags jika ada, jika tidak ada maka array kosong
              hint: hint || null, // Menambahkan hint, jika tidak ada maka null
            },
          ])
          .select("*"); // Select biar return data yang baru dibuat

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        return res.status(201).json({ message: "Challenge berhasil ditambahkan!", data });
      });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
