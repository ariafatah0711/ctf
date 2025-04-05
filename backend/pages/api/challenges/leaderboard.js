// backend/pages/api/challenges/leaderboard.js
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { data, error } = await supabase.rpc("get_leaderboard");

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        if (!Array.isArray(data)) {
          return res.status(500).json({ message: "Leaderboard response is not an array" });
        }

        // Sorting & rank (misal berdasarkan skor tertinggi)
        const sorted = data.sort((a, b) => b.score - a.score);

        const paginated = sorted.slice(offset, offset + limit).map((item, index) => ({
          ...item,
          rank: offset + index + 1,
        }));

        const totalPages = Math.ceil(sorted.length / limit);

        return res.status(200).json({
          leaderboard: paginated,
          totalPages,
          total: sorted.length,
          currentPage: page,
        });
      });
    } catch (error) {
      console.error("RPC get_leaderboard error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
