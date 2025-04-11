import handler from "@/lib/handler";
import { verifyToken } from "@/lib/middleware/auth";
import { getChallengeHistoryByUserId } from "@/services/challenges";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken) // Token wajib, tapi hanya buat autentikasi
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = (req.query.userId as string) || null; // Ambil dari query aja
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await getChallengeHistoryByUserId(userId, { page, limit });

      if (result.error) {
        return res.status(500).json({ message: result.error });
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Challenge History error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  });
