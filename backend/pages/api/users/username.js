import supabaseAdmin from "@/lib/supabaseAdmin";
import { verifyToken } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Parameter 'username' diperlukan." });
    }

    try {
      verifyToken(req, res, async () => {
        // 1. Panggil fungsi get_user_by_username
        const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", { username_input: username });

        if (userError || !user || user.length === 0) {
          return res.status(404).json({ message: "User tidak ditemukan.", error: userError?.message });
        }

        const userData = user[0];

        // 2. Ambil daftar challenge yang diselesaikan user ini
        const { data: userSolves, error: solveError } = await supabaseAdmin
          .from("user_challenges")
          .select("challenge_id")
          .eq("user_id", userData.id);

        if (solveError) {
          return res.status(500).json({ message: "Gagal mengambil solved challenges.", error: solveError.message });
        }

        const challengeIds = userSolves.map((s) => s.challenge_id);
        let solvedChallenges = [];

        if (challengeIds.length > 0) {
          const { data: challengeData, error: challengeError } = await supabaseAdmin
            .from("challenges")
            .select("id, title")
            .in("id", challengeIds);

          if (challengeError) {
            return res.status(500).json({ message: "Gagal mengambil data challenge.", error: challengeError.message });
          }

          solvedChallenges = challengeData.map((c) => ({
            id: c.id,
            title: c.title,
          }));
        }

        return res.status(200).json({
          message: "Data user berhasil diambil.",
          data: {
            id: userData.id,
            username: userData.username || "Unknown",
            role: userData.role || "user",
            solves: solvedChallenges,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
