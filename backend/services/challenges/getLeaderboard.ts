// services/challenges/getLeaderboard.ts
import { supabase } from "@/lib/supabase";

export async function getLeaderboard(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase.rpc("get_leaderboard");

  if (error) return { error: error.message };
  if (!Array.isArray(data)) return { error: "Leaderboard response is not an array" };

  const sorted = data.sort((a, b) => b.score - a.score);
  const paginated = sorted.slice(offset, offset + limit).map((item, index) => ({
    ...item,
    rank: offset + index + 1,
  }));

  return {
    leaderboard: paginated,
    totalPages: Math.ceil(sorted.length / limit),
    total: sorted.length,
    currentPage: page,
  };
}