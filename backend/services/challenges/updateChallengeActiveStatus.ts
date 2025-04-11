import { supabase } from "@/lib/supabase";
import { checkIfChallengeExists } from "@/utils/checkIfChallengeExists";

export async function updateChallengeActiveStatus(id, status) {
  const { exists, error: findError } = await checkIfChallengeExists(id);
  if (findError) return { error: findError.message };
  if (!exists) return { error: "Challenge tidak ditemukan.", notFound: true };

  const updatedActiveStatus = status === "true" || status === true;

  const { data, error } = await supabase
    .from("challenges")
    .update({ active: updatedActiveStatus })
    .eq("id", id);

  if (error) return { error: error.message };
  return { data };
}