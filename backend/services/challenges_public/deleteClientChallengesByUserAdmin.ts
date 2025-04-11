import { supabase } from "@/lib/supabase";

export async function deleteClientChallengesByUserAdmin(user_id: string) {
  const { error } = await supabase.from("client_challenges").delete().eq("user_id", user_id);
  if (error) return { error: error.message };
  return { success: true };
}