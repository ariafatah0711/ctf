import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encrypt";

export async function getUserClientChallenges(userId: string) {
  const { data, error } = await supabase
    .from("client_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) return { error: error.message };

  data.forEach((item) => {
    if (item.flag) item.flag = decrypt(item.flag);
  });

  return { data };
}
