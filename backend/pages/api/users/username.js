// // /backend/pages/api/users/username.js
// import supabase from "../../../lib/supabase";
// import { verifyToken } from "../../../lib/middleware/auth";

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   const { method } = req;

//   if (method === "GET") {
//     const { username } = req.query;

//     if (!username) {
//       return res.status(400).json({ message: "Parameter 'username' diperlukan." });
//     }

//     try {
//       verifyToken(req, res, async () => {
//         const { data, error } = await supabase.from("users").select("id, username, role").eq("username", username).single();

//         if (error || !data) {
//           return res.status(404).json({ message: "User tidak ditemukan.", error: error?.message });
//         }

//         return res.status(200).json({ message: "Data user berhasil diambil.", data });
//       });
//     } catch (error) {
//       return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
//     }
//   } else {
//     return res.status(405).json({ message: "Method tidak diizinkan." });
//   }
// }

import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;

  if (method === "GET") {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Parameter 'username' diperlukan." });
    }

    try {
      verifyToken(req, res, async () => {
        // 1. Ambil user
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id, username, role")
          .eq("username", username)
          .single();

        if (userError || !user) {
          return res.status(404).json({ message: "User tidak ditemukan.", error: userError?.message });
        }

        // 2. Ambil daftar challenge yang diselesaikan oleh user ini
        const { data: userSolves, error: solveError } = await supabase
          .from("user_challenges")
          .select("challenge_id")
          .eq("user_id", user.id);

        if (solveError) {
          return res.status(500).json({ message: "Gagal mengambil solved challenges.", error: solveError.message });
        }

        const challengeIds = userSolves.map((s) => s.challenge_id);

        let solvedChallenges = [];

        if (challengeIds.length > 0) {
          const { data: challengeData, error: challengeError } = await supabase
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
            ...user,
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
