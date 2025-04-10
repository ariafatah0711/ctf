// import supabaseAdmin from "@/lib/supabaseAdmin";

// export async function getUserWithSolves(username) {
//   // const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", { username_input: username });
//   const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", { username_input: username });
//   if (userError || !user || user.length === 0) return { error: userError?.message || "User tidak ditemukan." };

//   const userData = user[0];
//   const { data: userSolves, error: solveError } = await supabaseAdmin
//     .from("user_challenges")
//     .select("challenge_id")
//     .eq("user_id", userData.id);

//   if (solveError) return { error: solveError.message };

//   const challengeIds = userSolves.map((s) => s.challenge_id);
//   let solvedChallenges = [];

//   if (challengeIds.length > 0) {
//     const { data: challengeData, error: challengeError } = await supabaseAdmin
//       .from("challenges")
//       .select("id, title, difficulty, tags")
//       .eq("active", true)
//       .in("id", challengeIds);

//     if (challengeError) return { error: challengeError.message };

//     solvedChallenges = challengeData.map((c) => ({
//       id: c.id,
//       title: c.title,
//       difficulty: c.difficulty,
//       tags: c.tags,
//     }));
//   }

//   const initials = username
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => word[0]?.toUpperCase() || "")
//     .join("");

//   return {
//     data: {
//       id: userData.id,
//       username: userData.username || "N/A",
//       email: userData.email || "N/A",
//       role: userData.role || "user",
//       solves: solvedChallenges,
//       avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`,
//     },
//   };
// }

import supabaseAdmin from "@/lib/supabaseAdmin";

export async function getUserWithSolves(username) {
  const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", {
    username_input: username,
  });
  if (userError || !user || user.length === 0) return { error: userError?.message || "User tidak ditemukan." };

  const userData = user[0];

  const { data: userSolves, error: solveError } = await supabaseAdmin
    .from("user_challenges")
    .select("challenge_id")
    .eq("user_id", userData.id);
  if (solveError) return { error: solveError.message };

  const solvedIds = userSolves.map((s) => s.challenge_id);

  const { data: allChallenges, error: challengeError } = await supabaseAdmin
    .from("challenges")
    .select("id, title, difficulty, tags")
    .eq("active", true);
  if (challengeError) return { error: challengeError.message };

  const solvedChallenges = allChallenges.filter((c) => solvedIds.includes(c.id));
  const notSolvedChallenges = allChallenges.filter((c) => !solvedIds.includes(c.id));

  function countDifficulty(challenges) {
    const result = { easy: 0, medium: 0, hard: 0, undefined: 0 };
    for (const c of challenges) {
      if (c.difficulty === 1) result.easy++;
      else if (c.difficulty === 2) result.medium++;
      else if (c.difficulty === 3) result.hard++;
      else result.undefined++;
    }
    return result;
  }

  function countTags(challenges) {
    const tagCount = {};
    for (const c of challenges) {
      for (const tag of c.tags || []) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
    return tagCount;
  }

  const completeDifficulty = {
    easy: {
      solved: countDifficulty(solvedChallenges).easy,
      notSolved: countDifficulty(notSolvedChallenges).easy,
    },
    medium: {
      solved: countDifficulty(solvedChallenges).medium,
      notSolved: countDifficulty(notSolvedChallenges).medium,
    },
    hard: {
      solved: countDifficulty(solvedChallenges).hard,
      notSolved: countDifficulty(notSolvedChallenges).hard,
    },
  };

  const allTags = new Set();
  for (const c of allChallenges) {
    for (const tag of c.tags || []) {
      allTags.add(tag);
    }
  }

  const completeTags = {};
  for (const tag of allTags) {
    completeTags[tag] = {
      solved: solvedChallenges.filter((c) => (c.tags || []).includes(tag)).length,
      notSolved: notSolvedChallenges.filter((c) => (c.tags || []).includes(tag)).length,
    };
  }

  const initials = username
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  function getPercentage(solved, total) {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  }

  const percentages = {
    difficulty: {
      easy: getPercentage(completeDifficulty.easy.solved, completeDifficulty.easy.solved + completeDifficulty.easy.notSolved),
      medium: getPercentage(
        completeDifficulty.medium.solved,
        completeDifficulty.medium.solved + completeDifficulty.medium.notSolved
      ),
      hard: getPercentage(completeDifficulty.hard.solved, completeDifficulty.hard.solved + completeDifficulty.hard.notSolved),
    },
    tags: {},
  };

  for (const tag in completeTags) {
    const solved = completeTags[tag].solved;
    const total = completeTags[tag].solved + completeTags[tag].notSolved;
    percentages.tags[tag] = getPercentage(solved, total);
  }

  return {
    data: {
      id: userData.id,
      username: userData.username || "N/A",
      email: userData.email || "N/A",
      role: userData.role || "user",
      solves: solvedChallenges,
      userDifficulty: countDifficulty(solvedChallenges),
      userTags: countTags(solvedChallenges),
      completeDifficulty,
      completeTags,
      percentages,
      avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`,
    },
  };
}
