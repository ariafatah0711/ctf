import { supabase } from "@/lib/supabase";

export async function getChallengeHistoryByUserId(userId = null, { page = 1, limit = 10 }) {
  const { data, error, count } = await supabase.rpc("get_challenge_history", {
    p_user_id: userId,
    p_page: page,
    p_limit: limit,
  });

  if (error) return { error: error.message };

  return {
    data,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}
