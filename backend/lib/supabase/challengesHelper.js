import supabase from "@/lib/supabase";
import { encrypt, decrypt, hashFlag } from "@/lib/encrypt";
import { validateChallengeFields } from "../utils/validatorChallenges";
import { checkIfChallengeExists } from "../utils/challexit";

export async function submitChallenge(userId, flag) {
  if (!flag) return { error: "Flag harus diisi." };

  const { data: challenges, error: challengeFetchError } = await supabase.from("challenges").select("id, flag");
  if (challengeFetchError) return { error: "Gagal mengambil daftar challenge." };

  const matched = challenges.find((ch) => decrypt(ch.flag) === flag);
  if (!matched) return { error: "Flag salah." };

  const { data: existingChallenge, error: existingError } = await supabase
    .from("user_challenges")
    .select("user_id, challenge_id")
    .eq("user_id", userId)
    .eq("challenge_id", matched.id)
    .single();

  if (existingError && existingError.code !== "PGRST116")
    // PGRST116 = no rows found (diabaikan karena berarti belum solve)
    return { error: "Gagal memeriksa penyelesaian sebelumnya." };

  if (existingChallenge) return { error: "Challenge ini sudah diselesaikan oleh pengguna ini." };

  const { error: insertError } = await supabase.from("user_challenges").insert([
    {
      user_id: userId,
      challenge_id: matched.id,
      completed_at: new Date().toISOString(),
    },
  ]);

  if (insertError) return { error: insertError.message };

  return {
    success: true,
    message: "Challenge berhasil disubmit dan flag valid!",
    challengeId: matched.id,
  };
}

export async function getLeaderboard(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { data, error } = await supabase.rpc("get_leaderboard");

  if (error) return { error: error.message };
  if (!Array.isArray(data)) return { error: "Leaderboard response is not an array" };

  // Sort & paginate
  const sorted = data.sort((a, b) => b.score - a.score);
  const paginated = sorted.slice(offset, offset + limit).map((item, index) => ({
    ...item,
    rank: offset + index + 1,
  }));

  return {
    leaderboard: paginated,
    totalPages: Math.ceil(sorted.length / limit),
    total: sorted.length,
    currentPage: page,
  };
}

// index.js
export async function fetchChallengesWithFilters(userId, { tags, difficulty, title, page = 1, limit = 9 }) {
  let query = supabase
    .from("challenges")
    .select(
      `
      id, title, difficulty, created_at, tags,
      user_challenges(challenge_id, user_id)
    `,
      { count: "exact" }
    )
    .range((page - 1) * limit, page * limit - 1);

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    query = query.contains("tags", tagArray);
  }

  if (difficulty) query = query.eq("difficulty", parseInt(difficulty));
  if (title) query = query.ilike("title", `%${title}%`);

  const { data, error, count } = await query;
  if (error) return { error: error.message };

  const result = data.map((challenge) => ({
    ...challenge,
    solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
  }));

  return {
    data: result,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
}

export async function createChallenge({ title, description, difficulty, flag, url, tags = [], hint = null }) {
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  const encryptedFlag = encrypt(flag);
  const flagHash = hashFlag(flag);

  const { data, error } = await supabase
    .from("challenges")
    .insert([
      {
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

// id.js
export async function getChallengeDetailWithSolvers(id) {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, difficulty, created_at, url, tags, hint")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

  const { data: solversData, error: solversError } = await supabase
    .from("user_challenges")
    .select("user_id, completed_at")
    .eq("challenge_id", id);

  if (solversError) return { error: solversError.message };

  const userIds = solversData.map((solver) => solver.user_id);
  const solvers = [];

  for (const userId of userIds) {
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    solvers.push({
      user_id: userId,
      username: userError ? "Unknown User" : userData.user.user_metadata?.display_name || "Unknown User",
      completed_at: solversData.find((s) => s.user_id === userId).completed_at,
    });
  }

  return {
    data: {
      challenge: data,
      solvers,
    },
  };
}

export async function getChallengeWithFlagById(id) {
  // const { data, error } = await supabase.from("challenges").select("*").eq("id", id).single();
  const { data, error } = await supabase.from("challenges").select("*").eq("id", id).single();
  if (error) return { error: error.message };
  if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };

  // 🔓 Decrypt flag sebelum dikirim
  data.flag = decrypt(data.flag);
  return { data };
}

export async function updateChallenge(id, { title, description, difficulty, flag, url, tags = [], hint = null }) {
  // Validasi
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  const { exists, error: findError } = await checkIfChallengeExists(id);
  if (findError) return { error: findError.message };
  if (!exists) return { error: "Challenge tidak ditemukan.", notFound: true };

  const encryptedFlag = encrypt(flag);

  const { data, error } = await supabase
    .from("challenges")
    .update({ title, description, difficulty, flag: encryptedFlag, url, tags, hint })
    .eq("id", id)
    .select("*");

  if (error) return { error: error.message };
  return { data };
}

export async function deleteChallengeById(id) {
  const { exists, error: findError } = await checkIfChallengeExists(id);
  if (findError) return { error: findError.message };
  if (!exists) return { error: "Challenge tidak ditemukan.", notFound: true };

  // Hapus challenge
  const { data, error } = await supabase.from("challenges").delete().eq("id", id);

  if (error) return { error: error.message };
  return { data };
}
