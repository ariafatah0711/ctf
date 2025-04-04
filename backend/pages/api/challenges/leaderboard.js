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
        const { data, error } = await supabase.rpc("get_leaderboard");

        if (error) {
          return res.status(500).json({ message: error.message });
        }

        if (!Array.isArray(data)) {
          return res.status(500).json({ message: "Leaderboard response is not an array" });
        }

        // Tambahkan rank berdasarkan urutan
        const leaderboard = data.map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

        return res.status(200).json({ leaderboard });
        // // Memanggil fungsi get_user_challenge_solves untuk mendapatkan data
        // const { data, error } = await supabase.rpc("get_user_challenge_solves");

        // if (error) {
        //   return res.status(500).json({ message: error.message });
        // }

        // // Menyusun data dalam format yang diinginkan
        // const userSolves = {};

        // // Mengumpulkan data berdasarkan user_id dan menghitung total solve_count per user
        // data.forEach((item) => {
        //   if (!userSolves[item.user_id]) {
        //     userSolves[item.user_id] = {
        //       total_solve_count: 0,
        //     };
        //   }

        //   // Menambahkan solve_count untuk setiap challenge yang diselesaikan
        //   userSolves[item.user_id].total_solve_count += item.solve_count;
        // });

        // // Mengurutkan pengguna berdasarkan total solve_count
        // const leaderboard = Object.keys(userSolves)
        //   .map((user_id) => ({
        //     user_id,
        //     total_solve_count: userSolves[user_id].total_solve_count,
        //   }))
        //   .sort((a, b) => b.total_solve_count - a.total_solve_count); // Urutkan berdasarkan total solve_count

        // // Menambahkan rank pada setiap user berdasarkan total solve_count
        // let currentRank = 1;
        // let lastSolveCount = null; // Untuk melacak solve_count sebelumnya

        // leaderboard.forEach((item, index) => {
        //   // Jika solve_count sama dengan sebelumnya, maka beri rank yang sama
        //   if (lastSolveCount === item.total_solve_count) {
        //     item.rank = currentRank;
        //   } else {
        //     item.rank = currentRank;
        //     currentRank++; // Beri rank berikutnya
        //   }

        //   lastSolveCount = item.total_solve_count; // Set solve_count terakhir untuk perbandingan berikutnya
        // });

        // // Menyusun hasil akhir dalam format yang diinginkan
        // const result = leaderboard.map((item) => ({
        //   user_id: item.user_id,
        //   rank: item.rank, // 1 rank per user
        // }));

        // return res.status(200).json({ leaderboard: result });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
