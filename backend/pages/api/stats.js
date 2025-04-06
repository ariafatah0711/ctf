import supabaseAdmin from "@/lib/supabaseAdmin";
import supabase from "@/lib/supabase";
import { withCors } from "@/lib/utils/withCors";
import { mapUsersByRole, mapChallengesByDifficulty, mapTagsDistribution } from "@/lib/utils/statsHelpers";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  try {
    const { data: userRaw, error: userRawErr } = await supabaseAdmin.auth.admin.listUsers();
    if (userRawErr) throw userRawErr;

    const totalUsers = userRaw.total;
    const usersByRole = mapUsersByRole(userRaw.users || []);

    const { count: totalChallenges } = await supabase.from("challenges").select("*", { count: "exact", head: true });

    const { data: diffRaw } = await supabase.from("challenges").select("difficulty");
    const challengesByDifficulty = mapChallengesByDifficulty(diffRaw || []);

    const { count: totalSolvedSubmissions } = await supabase.from("user_challenges").select("*", { count: "exact", head: true });

    const { data: uniqueSolvedRaw } = await supabase.from("user_challenges").select("challenge_id");
    const uniqueChallengesSolved = new Set(uniqueSolvedRaw?.map((e) => e.challenge_id)).size || 0;

    const { data: topUsersRaw } = await supabase.rpc("get_top_users");
    const topUsers = (topUsersRaw || []).map(({ username, solved }) => ({ username, solved }));

    const { data: tagsRaw } = await supabase.from("challenges").select("tags");
    const tagsDistribution = mapTagsDistribution(tagsRaw || []);

    const { data: leaderboardRaw } = await supabase.rpc("get_leaderboard");
    const leaderboard = (leaderboardRaw || []).slice(0, 5).map((u) => ({
      userId: u.user_id,
      username: u.username,
      solved: u.solved,
    }));

    const { data: solveStatsRaw } = await supabase.rpc("get_challenge_solves");
    const challengeSolves = (solveStatsRaw || []).map(({ challenge_id, solve_count }) => ({
      challengeId: challenge_id,
      count: solve_count,
    }));

    const mostSolvedChallengeA = challengeSolves.reduce((prev, current) => (prev.count > current.count ? prev : current), {
      challengeId: null,
      count: 0,
    });

    const { data: challengeTitle } = await supabase
      .from("challenges")
      .select("title")
      .eq("id", mostSolvedChallengeA.challengeId)
      .single();

    const mostSolvedChallenges = {
      ...mostSolvedChallengeA,
      title: challengeTitle?.title || "Unknown",
    };

    return res.status(200).json({
      totalUsers,
      usersByRole,
      totalChallenges,
      challengesByDifficulty,
      totalSolvedSubmissions,
      uniqueChallengesSolved,
      topUsers,
      mostSolvedChallenges,
      tagsDistribution,
      leaderboard,
      challengeSolves,
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
