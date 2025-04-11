import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function getChallengeDetailWithSolvers(id, userId, limit = 10, offset = 0, appendOnly = false) {
  let challengeData = null;

  if (!appendOnly) {
    const { data, error } = await supabase
      .from("challenges")
      .select("id, title, description, difficulty, created_at, url, tags, hint")
      .eq("id", id)
      .eq("active", true)
      .single();

    if (error) return { error: error.message };
    if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

    challengeData = data;
  }

  const { data: solversData, error: solversError } = await supabase
    .from("user_challenges")
    .select("user_id, completed_at")
    .eq("challenge_id", id)
    .order("completed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (solversError) return { error: solversError.message };

  const userIds = solversData.map((solver) => solver.user_id);
  const solvers = [];

  for (const uid of userIds) {
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(uid);

    solvers.push({
      user_id: uid,
      username: userError ? "Unknown User" : userData.user.user_metadata?.display_name || "Unknown User",
      completed_at: solversData.find((s) => s.user_id === uid).completed_at,
    });
  }

  const solved = userId ? solversData.some((solver) => solver.user_id === userId) : false;

  return appendOnly ? { solvers } : { data: { challenge: challengeData, solvers, solved } };
}