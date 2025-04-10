// backend\pages\api\stats.js
import supabaseAdmin from "@/lib/supabaseAdmin";
import supabase from "@/lib/supabase";
import { withCors } from "@/lib/utils/withCors";
import { mapUsersByRole, mapChallengesByDifficulty, mapTagsDistribution } from "@/lib/utils/statsHelpers";

// export default async function handler(req, res) {
//   if (withCors(req, res)) return;

//   try {
//     // Ambil semua user
//     const { data: userRaw, error: userRawErr } = await supabaseAdmin.auth.admin.listUsers();
//     if (userRawErr) throw userRawErr;

//     const totalUsers = userRaw.total;
//     const usersByRole = mapUsersByRole(userRaw.users || []);

//     // Ambil semua challenge sekali aja
//     const { data: challengesRaw, error: challengesErr } = await supabase
//       .from("challenges")
//       .select("id, title, difficulty, tags, active");

//     if (challengesErr) throw challengesErr;

//     const totalChallenges = challengesRaw.length;
//     const activeChallenges = challengesRaw.filter((c) => c.active);
//     const inactiveChallenges = challengesRaw.filter((c) => !c.active);
//     const totalActiveChallenges = activeChallenges.length;
//     const totalInactiveChallenges = inactiveChallenges.length;

//     const challengesByDifficulty = mapChallengesByDifficulty(activeChallenges);
//     const tagsDistribution = mapTagsDistribution(activeChallenges);

//     // Total submission
//     const { count: totalSolvedSubmissions } = await supabase.from("user_challenges").select("*", { count: "exact", head: true });
//     // Unique challenge yang pernah disolve
//     const { data: uniqueSolvedRaw } = await supabase.from("user_challenges").select("challenge_id");

//     const uniqueChallengesSolved = new Set(uniqueSolvedRaw?.map((e) => e.challenge_id)).size || 0;

//     // Top user dari function bawaan
//     const { data: topUsersRaw } = await supabase.rpc("get_top_users");
//     const topUsers = (topUsersRaw || []).map(({ username, solved }) => ({ username, solved }));

//     // Leaderboard
//     const { data: leaderboardRaw } = await supabase.rpc("get_leaderboard");
//     const leaderboard = (leaderboardRaw || []).slice(0, 5).map((u) => ({
//       userId: u.user_id,
//       username: u.username,
//       solved: u.solved,
//     }));

//     // Data solve per challenge
//     const { data: solveStatsRaw } = await supabase.rpc("get_challenge_solves");
//     const challengeSolves = (solveStatsRaw || []).map(({ challenge_id, solve_count }) => ({
//       challengeId: challenge_id,
//       count: solve_count,
//     }));

//     // Cari challenge paling banyak disolve
//     const mostSolvedChallengeA = challengeSolves.reduce((prev, current) => (prev.count > current.count ? prev : current), {
//       challengeId: null,
//       count: 0,
//     });

//     // Ambil judul challenge paling banyak disolve
//     const { data: challengeTitle } = await supabase
//       .from("challenges")
//       .select("title")
//       .eq("id", mostSolvedChallengeA.challengeId)
//       .single();

//     const mostSolvedChallenges = {
//       ...mostSolvedChallengeA,
//       title: challengeTitle?.title || "Unknown",
//     };

//     // Kirim semua data
//     return res.status(200).json({
//       totalUsers,
//       usersByRole,
//       totalChallenges,
//       totalActiveChallenges,
//       totalInactiveChallenges,
//       challengesByDifficulty,
//       tagsDistribution,
//       totalSolvedSubmissions,
//       uniqueChallengesSolved,
//       topUsers,
//       mostSolvedChallenges,
//       leaderboard,
//       challengeSolves,
//       description: {
//         challengeSummary: `Terdapat total ${totalChallenges} challenge (${totalActiveChallenges} aktif, ${totalInactiveChallenges} tidak aktif).`,
//         topChallengeInfo: `Challenge paling banyak diselesaikan adalah "${mostSolvedChallenges.title}" sebanyak ${mostSolvedChallenges.count} kali.`,
//       },
//     });
//   } catch (err) {
//     console.error("Error getting stats:", err);
//     return res.status(500).json({ error: "Failed to fetch stats" });
//   }
// }

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  try {
    // Ambil semua user dengan pagination
    let users = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 100, // maksimal 100 per halaman
      });

      if (error) throw error;

      users.push(...data.users);
      console.log(`Page ${page + 1} - Fetched ${data.users.length} users`);

      hasMore = data.users.length === 100;
      page += 1;
    }

    const totalUsers = users.length;
    const usersByRole = mapUsersByRole(users);

    // Ambil semua challenge
    const { data: challengesRaw, error: challengesErr } = await supabase
      .from("challenges")
      .select("id, title, difficulty, tags, active");

    if (challengesErr) throw challengesErr;

    const totalChallenges = challengesRaw.length;
    const activeChallenges = challengesRaw.filter((c) => c.active);
    const inactiveChallenges = challengesRaw.filter((c) => !c.active);
    const totalActiveChallenges = activeChallenges.length;
    const totalInactiveChallenges = inactiveChallenges.length;

    const challengesByDifficulty = mapChallengesByDifficulty(activeChallenges);
    const tagsDistribution = mapTagsDistribution(activeChallenges);

    // Total submission
    const { count: totalSolvedSubmissions } = await supabase.from("user_challenges").select("*", { count: "exact", head: true });

    // Unique challenge yang pernah disolve
    const { data: uniqueSolvedRaw } = await supabase.from("user_challenges").select("challenge_id");

    const uniqueChallengesSolved = new Set(uniqueSolvedRaw?.map((e) => e.challenge_id)).size || 0;

    // Top user dari function bawaan
    const { data: topUsersRaw } = await supabase.rpc("get_top_users");
    const topUsers = (topUsersRaw || []).map(({ username, solved }) => ({ username, solved }));

    // Leaderboard
    const { data: leaderboardRaw } = await supabase.rpc("get_leaderboard");
    const leaderboard = (leaderboardRaw || []).slice(0, 5).map((u) => ({
      userId: u.user_id,
      username: u.username,
      solved: u.solved,
    }));

    // Data solve per challenge
    const { data: solveStatsRaw } = await supabase.rpc("get_challenge_solves");
    const challengeSolves = (solveStatsRaw || []).map(({ challenge_id, solve_count }) => ({
      challengeId: challenge_id,
      count: solve_count,
    }));

    // Cari challenge paling banyak disolve
    const mostSolvedChallengeA = challengeSolves.reduce((prev, current) => (prev.count > current.count ? prev : current), {
      challengeId: null,
      count: 0,
    });

    // Ambil judul challenge paling banyak disolve
    const { data: challengeTitle } = await supabase
      .from("challenges")
      .select("title")
      .eq("id", mostSolvedChallengeA.challengeId)
      .single();

    const mostSolvedChallenges = {
      ...mostSolvedChallengeA,
      title: challengeTitle?.title || "Unknown",
    };

    // Ambil data client challenges
    const { data: clientChalsRaw, error: clientChalsErr } = await supabase
      .from("client_challenges")
      .select("id, reviewed, accepted");

    if (clientChalsErr) throw clientChalsErr;

    const totalClientChallenges = clientChalsRaw.length;
    const totalReviewed = clientChalsRaw.filter((c) => c.reviewed === true).length;
    const totalAccepted = clientChalsRaw.filter((c) => c.accepted === true).length;
    const totalRejected = clientChalsRaw.filter((c) => c.accepted === false).length;

    return res.status(200).json({
      totalUsers,
      usersByRole,
      totalChallenges,
      totalActiveChallenges,
      totalInactiveChallenges,
      challengesByDifficulty,
      tagsDistribution,
      totalSolvedSubmissions,
      uniqueChallengesSolved,
      topUsers,
      mostSolvedChallenges,
      leaderboard,
      challengeSolves,
      clientChallenges: {
        total: totalClientChallenges,
        reviewed: totalReviewed,
        accepted: totalAccepted,
        rejected: totalRejected,
      },

      description: {
        challengeSummary: `Terdapat total ${totalChallenges} challenge (${totalActiveChallenges} aktif, ${totalInactiveChallenges} tidak aktif).`,
        topChallengeInfo: `Challenge paling banyak diselesaikan adalah "${mostSolvedChallenges.title}" sebanyak ${mostSolvedChallenges.count} kali.`,
      },
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
}
