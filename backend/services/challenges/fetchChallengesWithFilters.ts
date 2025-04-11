// services/challenges/fetchChallengesWithFilters.ts
import { supabase } from "@/lib/supabase";

export async function fetchChallengesWithFilters(
  userId: string,
  {
    tags,
    difficulty,
    title,
    page = 1,
    limit = 9,
    active = true,
  }: {
    tags?: string[] | string;
    difficulty?: number;
    title?: string;
    page?: number;
    limit?: number;
    active?: boolean | string;
  }
) {
  let query = supabase.from("challenges").select(
    `id, title, difficulty, created_at, tags, active, user_challenges(challenge_id, user_id)`,
    { count: "exact" }
  );

  query = query.order("created_at", { ascending: false });

  if (active !== "all") {
    query = query.eq("active", active === "true" || active === true);
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query = query.contains("tags", tagArray);
  }

  if (difficulty) query = query.eq("difficulty", parseInt(String(difficulty)));
  if (title) query = query.ilike("title", `%${title}%`);

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;
  if (error) return { error: error.message };

  const result = data.map((challenge) => ({
    ...challenge,
    solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
  }));

  const { data: allChallenges, error: tagError } = await supabase.from("challenges").select("tags");
  if (tagError) return { error: tagError.message };

  const allTags = Array.from(
    new Set(allChallenges.flatMap((challenge) => challenge.tags || []).filter(Boolean))
  );

  return {
    data: result,
    total: count,
    page: parseInt(String(page)),
    totalPages: Math.ceil(count / limit),
    tags: allTags,
  };
}
