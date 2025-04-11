import { supabase } from "@/lib/supabase";

export async function clearOldClientChallengesAdmin() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { error } = await supabase
    .from("client_challenges")
    .delete()
    .lt("submitted_at", oneWeekAgo.toISOString());

  if (error) return { error: error.message };
  return { success: true };
}