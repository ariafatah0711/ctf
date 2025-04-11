// backend/pages/api/challenges/leaderboard.ts
import handler from "@/lib/handler";
import { getLeaderboard } from "@/services/challenges";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler().get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getLeaderboard(page, limit);

    if (result.error) {
      return res.status(500).json({ message: result.error });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan.",
      error: error.message,
    });
  }
});