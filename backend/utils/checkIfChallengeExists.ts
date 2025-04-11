import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

export async function checkIfChallengeExists(id: string): Promise<{ exists: boolean, error?: PostgrestError }> {
  const { data, error } = await supabase
    .from("challenges")
    .select("id")
    .eq("id", id)
    .single();

  if (error) return { exists: false, error };
  return { exists: !!data };
}