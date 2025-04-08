import supabaseAdmin from "@/lib/supabaseAdmin";

export async function getUserWithSolves(username) {
  // const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", { username_input: username });
  const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", { username_input: username });
  if (userError || !user || user.length === 0) return { error: userError?.message || "User tidak ditemukan." };

  const userData = user[0];
  const { data: userSolves, error: solveError } = await supabaseAdmin
    .from("user_challenges")
    .select("challenge_id")
    .eq("user_id", userData.id);

  if (solveError) return { error: solveError.message };

  const challengeIds = userSolves.map((s) => s.challenge_id);
  let solvedChallenges = [];

  if (challengeIds.length > 0) {
    const { data: challengeData, error: challengeError } = await supabaseAdmin
      .from("challenges")
      .select("id, title")
      .eq("active", true)
      .in("id", challengeIds);

    if (challengeError) return { error: challengeError.message };

    solvedChallenges = challengeData.map((c) => ({
      id: c.id,
      title: c.title,
    }));
  }

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  return {
    data: {
      id: userData.id,
      username: userData.username || "N/A",
      email: userData.email || "N/A",
      role: userData.role || "user",
      solves: solvedChallenges,
      avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`,
    },
  };
}
