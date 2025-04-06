import supabase from "../supabase";

export async function checkIfChallengeExists(id) {
  const { data, error } = await supabase.from("challenges").select("id").eq("id", id).single();

  if (error) return { exists: false, error };
  return { exists: !!data };
}
