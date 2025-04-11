import { supabase } from "@/lib/supabase";

export async function deleteClientChallenge(id: string, userId: string, isAdmin = false) {
  const query = supabase.from("client_challenges").delete().eq("id", id);
  if (!isAdmin) query.eq("user_id", userId);

  const { error } = await query;
  if (error) return { error: error.message };

  return { success: true };
}