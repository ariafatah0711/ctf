import { supabase } from "@/lib/supabase";

export async function deleteClientChallengeByIdAdmin(id: string) {
  const { error } = await supabase.from("client_challenges").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}