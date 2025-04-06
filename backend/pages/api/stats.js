import supabaseAdmin from "@/lib/supabaseAdmin";
import supabase from "@/lib/supabase";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Total users
    const { data: userCountRaw, error: userCountErr } = await supabaseAdmin.rpc("get_user_count");
    if (userCountErr) throw userCountErr;
    const totalUsers = userCountRaw?.[0]?.count ?? 0;

    // 2. Users by role
    const { data: rolesRaw } = await supabaseAdmin.from("users").select("");
    const usersByRole = rolesRaw;

    // const usersByRoleArr =
    //   rolesRaw?.reduce((acc, user) => {
    //     const role = user.raw_user_meta_data?.role || "unknown";
    //     acc[role] = (acc[role] || 0) + 1;
    //     return acc;
    //   }, {}) || {};

    // const usersByRole = Object.entries(usersByRoleArr).map(([role, count]) => ({
    //   role,
    //   count,
    // }));

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

    // 8. Most solved challenges
    const { data: topChallsRaw } = await supabase.rpc("get_most_solved_challenges");
    const mostSolvedChallenges = (topChallsRaw || []).map(({ title, times_solved }) => ({
      title,
      solved: times_solved,
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

    return res.status(200).json({
      ...(typeof totalUsers === "number" && { totalUsers }),
      //   ...(usersByRole.length > 0 && { usersByRole }),
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
      ...(mostSolvedChallenges.length > 0 && { mostSolvedChallenges }),
      ...(tagsDistribution.length > 0 && { tagsDistribution }),
      ...(leaderboard.length > 0 && { leaderboard }),
      ...(challengeSolves.length > 0 && { challengeSolves }),
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
