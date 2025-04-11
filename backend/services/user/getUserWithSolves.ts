import { supabaseAdmin } from "@/lib/supabase";

interface Challenge {
  id: number;
  title: string;
  difficulty: number | null;
  tags: string[] | null;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface CompleteDifficulty {
  easy: { solved: number; notSolved: number };
  medium: { solved: number; notSolved: number };
  hard: { solved: number; notSolved: number };
}

interface CompleteTags {
  [tag: string]: {
    solved: number;
    notSolved: number;
  };
}

export async function getUserWithSolves(username: string): Promise<{ data?: any; error?: string }> {
  const { data: user, error: userError } = await supabaseAdmin.rpc("get_user_by_username", {
    username_input: username,
  });

  if (userError || !user || user.length === 0) {
    return { error: userError?.message || "User tidak ditemukan." };
  }

  const userData: UserData = user[0];

  const { data: userSolves, error: solveError } = await supabaseAdmin
    .from("user_challenges")
    .select("challenge_id")
    .eq("user_id", userData.id);

  if (solveError) return { error: solveError.message };

  const solvedIds = userSolves.map((s: { challenge_id: number }) => s.challenge_id);

  const { data: allChallenges, error: challengeError } = await supabaseAdmin
    .from("challenges")
    .select("id, title, difficulty, tags")
    .eq("active", true);

  if (challengeError) return { error: challengeError.message };

  const solvedChallenges = (allChallenges as Challenge[]).filter((c) => solvedIds.includes(c.id));
  const notSolvedChallenges = (allChallenges as Challenge[]).filter((c) => !solvedIds.includes(c.id));

  function countDifficulty(challenges: Challenge[]) {
    const result = { easy: 0, medium: 0, hard: 0, undefined: 0 };
    for (const c of challenges) {
      if (c.difficulty === 1) result.easy++;
      else if (c.difficulty === 2) result.medium++;
      else if (c.difficulty === 3) result.hard++;
      else result.undefined++;
    }
    return result;
  }

  function countTags(challenges: Challenge[]) {
    const tagCount: Record<string, number> = {};
    for (const c of challenges) {
      for (const tag of c.tags || []) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
    return tagCount;
  }

  const completeDifficulty: CompleteDifficulty = {
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

  const allTags = new Set<string>();
  for (const c of allChallenges as Challenge[]) {
    for (const tag of c.tags || []) {
      allTags.add(tag);
    }
  }

  const completeTags: CompleteTags = {};
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

  function getPercentage(solved: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  }

  const percentages = {
    difficulty: {
      easy: getPercentage(
        completeDifficulty.easy.solved,
        completeDifficulty.easy.solved + completeDifficulty.easy.notSolved
      ),
      medium: getPercentage(
        completeDifficulty.medium.solved,
        completeDifficulty.medium.solved + completeDifficulty.medium.notSolved
      ),
      hard: getPercentage(
        completeDifficulty.hard.solved,
        completeDifficulty.hard.solved + completeDifficulty.hard.notSolved
      ),
    },
    tags: {} as Record<string, number>,
  };

  for (const tag in completeTags) {
    const solved = completeTags[tag].solved;
    const total = solved + completeTags[tag].notSolved;
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