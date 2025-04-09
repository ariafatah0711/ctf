import supabase from "@/lib/supabase";
import supabaseAdmin from "../supabaseAdmin";
import { validateChallengeFields } from "./helpers/validateChallengeFields";

export async function createPublicChallenge({ user_id, title, description, difficulty, flag, url, tags = [], hint = null }) {
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  // 🔍 Cek jumlah challenge yang sudah dibuat user ini
  const { count, error: countError } = await supabase
    .from("public_challenges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (countError) return { error: countError.message };
  if (count >= 3) return { error: "Kamu hanya bisa membuat maksimal 3 challenge publik." };

  const encryptedFlag = encrypt(flag);
  const flagHash = hashFlag(flag);

  const { data, error } = await supabase
    .from("public_challenges")
    .insert([
      {
        user_id,
        title,
        description,
        difficulty,
        flag: encryptedFlag,
        flag_hash: flagHash,
        url,
        tags,
        hint,
      },
    ])
    .select("*");

  if (error) return { error: error.message };
  return { data };
}

export async function getPublicChallengeById(id, userId, isAdmin = false) {
  const query = supabase.from("public_challenges").select("*").eq("id", id).maybeSingle();

  if (!isAdmin) query.eq("user_id", userId);

  const { data, error } = await query;

  if (error) return { error: error.message };
  if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

  data.flag = decrypt(data.flag);
  return { data };
}

export async function updatePublicChallenge(
  id,
  userId,
  { title, description, difficulty, flag, url, tags = [], hint = null },
  isAdmin = false
) {
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  const encryptedFlag = encrypt(flag);

  const query = supabase
    .from("public_challenges")
    .update({ title, description, difficulty, flag: encryptedFlag, url, tags, hint })
    .eq("id", id);

  if (!isAdmin) query.eq("user_id", userId);

  const { data, error } = await query.select("*");

  if (error) return { error: error.message };
  return { data };
}

export async function deletePublicChallenge(id, userId, isAdmin = false) {
  const query = supabase.from("public_challenges").delete().eq("id", id);

  if (!isAdmin) query.eq("user_id", userId);

  const { error } = await query;
  if (error) return { error: error.message };

  return { success: true };
}

export async function getUserPublicChallenges(userId) {
  const { data, error } = await supabase
    .from("public_challenges")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
