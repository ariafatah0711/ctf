import { supabase } from "@/lib/supabase";
import { checkIfChallengeExists } from "@/utils/checkIfChallengeExists";

export async function deleteChallengeById(id) {
  const { exists, error: findError } = await checkIfChallengeExists(id);
  if (findError) return { error: findError.message };
  if (!exists) return { error: "Challenge tidak ditemukan.", notFound: true };

  const { data, error } = await supabase.from("challenges").delete().eq("id", id);

  if (error) return { error: error.message };
  return { data };
}