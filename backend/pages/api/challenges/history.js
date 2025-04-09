import { withCors } from "@/lib/utils/withCors";
import { getChallengeHistoryByUserId } from "@/lib/supabase/challengesHelper";

export default async function handler(req, res) {
  // Apply CORS middleware
  if (withCors(req, res)) return;

  if (req.method === "GET") {
    try {
      // Parse query parameters
      const userId = req.query.userId || null; // Bisa pakai query userId jika ingin filter
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Ambil riwayat tantangan
      const result = await getChallengeHistoryByUserId(userId, { page, limit });

      if (result.error) {
        return res.status(500).json({ message: result.error });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Challenge History error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
