// backend/pages/api/challenges/solves.js
import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";

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
        // Memanggil fungsi get_user_challenge_solves untuk mendapatkan data
        const { data, error } = await supabase.rpc("get_user_challenge_solves");

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        // Menyusun data dalam format yang diinginkan
        const challenges = {};

        // Mengubah data menjadi format yang diinginkan
        data.forEach((item) => {
          if (!challenges[item.challenge_id]) {
            challenges[item.challenge_id] = {
              users: [],
              solve_count: 0,
            };
          }

          // Menambahkan user ke dalam challenge
          challenges[item.challenge_id].users.push(item.user_id);

          // Menambahkan solve_count
          challenges[item.challenge_id].solve_count++;
        });

        return res.status(200).json({ data: challenges });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
