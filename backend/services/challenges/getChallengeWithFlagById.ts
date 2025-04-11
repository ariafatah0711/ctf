import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encrypt";

export async function getChallengeWithFlagById(id) {
  const { data, error } = await supabase.from("challenges").select("*").eq("id", id).single();

  if (error) return { error: error.message };
  if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

  data.flag = decrypt(data.flag);
  return { data };
}