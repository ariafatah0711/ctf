import supabase from "@/lib/supabase";
import { validateChallengeFields } from "./helpers/validateChallengeFields";

export async function createClientChallenge({ user_id, title, description, difficulty, url, tags = [], hint = null }) {
  // const errorMessage = validateChallengeFields({ title, description, difficulty, url, tags, hint });
  // if (errorMessage) return { error: errorMessage };

  const { count, error: countError } = await supabase
    .from("client_challenges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (countError) return { error: countError.message };
  if (count >= 3) return { error: "Kamu hanya bisa membuat maksimal 3 challenge publik." };

  const { data, error } = await supabase
    .from("client_challenges")
    .insert([
      {
        user_id,
        title,
        description,
        difficulty,
        url,
        tags,
        hint,
      },
    ])
    .select("*");

  if (error) return { error: error.message };
  return { data };
}

export async function getClientChallengeById(id, userId, isAdmin = false) {
  const query = supabase.from("client_challenges").select("*").eq("id", id).maybeSingle();

  if (!isAdmin) query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) return { error: error.message };
  if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

  return { data };
}

export async function updateClientChallenge(
  id,
  userId,
  { title, description, difficulty, url, tags = [], hint = null },
  isAdmin = false
) {
  // const errorMessage = validateChallengeFields({ title, description, difficulty, url, tags, hint });
  // if (errorMessage) return { error: errorMessage };

  const query = supabase.from("client_challenges").update({ title, description, difficulty, url, tags, hint }).eq("id", id);

  if (!isAdmin) query.eq("user_id", userId);

  const { data, error } = await query.select("*");
  if (error) return { error: error.message };
  return { data };
}

export async function deleteClientChallenge(id, userId, isAdmin = false) {
  const query = supabase.from("client_challenges").delete().eq("id", id);

  if (!isAdmin) query.eq("user_id", userId);

  const { error } = await query;
  if (error) return { error: error.message };

  return { success: true };
}

export async function getUserClientChallenges(userId) {
  const { data, error } = await supabase
    .from("client_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
