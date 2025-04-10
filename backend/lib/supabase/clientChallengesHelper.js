import supabase from "@/lib/supabase";
import { encrypt, hashFlag, decrypt } from "../encrypt";

export async function createClientChallenge({
  user_id,
  title,
  description,
  difficulty,
  url,
  tags = [],
  hint = null,
  flag = null,
}) {
  // 🔐 Encrypt flag kalau ada
  let encryptedFlag = null;
  let flagHash = null;
  if (flag) {
    encryptedFlag = encrypt(flag);
    flagHash = hashFlag(flag);
  }

  // ⛔ Cek limit challenge
  const { count, error: countError } = await supabase
    .from("client_challenges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (countError) return { error: countError.message };
  if (count >= 3) return { error: "Kamu hanya bisa membuat maksimal 3 challenge publik." };

  // ⛔ Cek duplikat judul
  const { data: existing, error: titleError } = await supabase
    .from("client_challenges")
    .select("id")
    .eq("user_id", user_id)
    .eq("title", title)
    .maybeSingle();

  if (titleError) return { error: titleError.message };
  if (existing) return { error: "Kamu sudah punya challenge dengan judul yang sama." };

  // ✅ Simpan challenge baru
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
        flag: encryptedFlag,
        flag_hash: flagHash,
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
  { title, description, difficulty, url, tags = [], hint = null, flag = null }, // ⬅️ tambah flag di sini
  isAdmin = false
) {
  // Duplikat title check tetap

  const updateFields = {
    title,
    description,
    difficulty,
    url,
    tags,
    hint,
    ...(isAdmin ? {} : { reviewed: false }),
  };

  if (flag) {
    updateFields.flag = encrypt(flag);
    updateFields.flag_hash = hashFlag(flag);
  }

  const query = supabase.from("client_challenges").update(updateFields).eq("id", id);
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

  data.forEach((item) => {
    if (item.flag) item.flag = decrypt(item.flag);
  });

  return { data };
}
