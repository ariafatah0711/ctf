import supabaseAdmin from "@/lib/supabaseAdmin";
import supabase from "@/lib/supabase";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { data: userRaw, error: userRawErr } = await supabaseAdmin.auth.admin.listUsers();
    if (userRawErr) throw userRawErr;
    const totalUsers = userRaw.total;

    const usersByRole = userRaw.users.reduce(
      (acc, user) => {
        const role = user.user_metadata?.role ?? "Unknown"; // Mengambil role dari user_metadata

        // Hitung jumlah role per jenis
        if (!acc.user_role[role]) {
          acc.user_role[role] = 1; // Jika role belum ada, mulai hitung dari 1
        } else {
          acc.user_role[role] += 1; // Jika role sudah ada, tambah 1
        }

        // Hitung total unique roles
        acc.total_role = Object.keys(acc.user_role).length;

        return acc;
      },
      { total_role: 0, user_role: {} }
    );

    // 3. Total challenges
    const { count: totalChallenges } = await supabase.from("challenges").select("*", { count: "exact", head: true });

    // 4. Challenges by difficulty
    const { data: diffRaw } = await supabase.from("challenges").select("difficulty");

    const diffMap =
      diffRaw?.reduce((acc, { difficulty }) => {
        const level = difficulty?.toString() || "0";
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {}) || {};

    const challengesByDifficulty = Object.entries(diffMap).map(([level, count]) => ({ level, count }));

    // 5. Total solved submissions
    const { count: totalSolvedSubmissions } = await supabase.from("user_challenges").select("*", { count: "exact", head: true });

    // 6. Unique challenges solved
    const { data: uniqueSolvedRaw } = await supabase.from("user_challenges").select("challenge_id");

    const uniqueChallengesSolved = new Set(uniqueSolvedRaw?.map((e) => e.challenge_id)).size || 0;

    // 7. Top users
    const { data: topUsersRaw } = await supabase.rpc("get_top_users");
    const topUsers = (topUsersRaw || []).map(({ username, solved }) => ({
      username,
      solved,
    }));

    // 9. Tags distribution
    const { data: tagsRaw } = await supabase.from("challenges").select("tags");

    const tagMap = {};
    tagsRaw?.forEach(({ tags }) => {
      tags?.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    const tagsDistribution = Object.entries(tagMap).map(([tag, count]) => ({
      tag,
      count,
    }));

    // 10. Leaderboard
    const { data: leaderboardRaw } = await supabase.rpc("get_leaderboard");
    const leaderboard = (leaderboardRaw || [])
      .map((u) => ({
        userId: u.user_id,
        username: u.username,
        solved: u.solved,
      }))
      .slice(0, 5);

    // 11. Challenge solves
    const { data: solveStatsRaw } = await supabase.rpc("get_challenge_solves");
    const challengeSolves = (solveStatsRaw || []).map(({ challenge_id, solve_count }) => ({
      challengeId: challenge_id,
      count: solve_count,
    }));

    const mostSolvedChallengeA = challengeSolves.reduce((prev, current) => (prev.count > current.count ? prev : current));

    // Langkah ketiga: Mengambil nama challenge berdasarkan challengeId
    const { data: challenges } = await supabase
      .from("challenges") // ganti dengan nama tabel yang menyimpan data challenge
      .select("title") // pastikan ada kolom 'title' pada tabel challenges
      .eq("id", mostSolvedChallengeA.challengeId);

    const mostSolvedChallenges = {
      ...mostSolvedChallengeA, // Memastikan untuk menggunakan mostSolvedChallengeA
      title: challenges[0]?.title, // Menambahkan nama challenge
    };

    return res.status(200).json({
      ...(typeof totalUsers === "number" && { totalUsers }),
      usersByRole,
      ...(typeof totalChallenges === "number" && { totalChallenges }),
      ...(challengesByDifficulty.length > 0 && { challengesByDifficulty }),
      ...(typeof totalSolvedSubmissions === "number" && {
        totalSolvedSubmissions,
      }),
      ...(typeof uniqueChallengesSolved === "number" && {
        uniqueChallengesSolved,
      }),
      ...(topUsers.length > 0 && { topUsers }),
      //   ...(mostSolvedChallenges.length > 0 && { mostSolvedChallenges }),
      mostSolvedChallenges,
      ...(tagsDistribution.length > 0 && { tagsDistribution }),
      ...(leaderboard.length > 0 && { leaderboard }),
      ...(challengeSolves.length > 0 && { challengeSolves }),
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
