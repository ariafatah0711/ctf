// backend/pages/api/challenges/leaderboard.js
import { verifyToken } from "../../../lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";
import { getLeaderboard } from "@/lib/supabase/challengesHelper";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getLeaderboard(page, limit);

        if (result.error) {
          return res.status(500).json({ message: result.error });
        }

        return res.status(200).json(result);
      } catch (error) {
        console.error("Leaderboard error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
      }
    });
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
