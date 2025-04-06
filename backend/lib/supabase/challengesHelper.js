import supabase from "@/lib/supabase";
import { encrypt, decrypt, hashFlag } from "@/lib/encrypt";

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

export async function createChallenge({ title, description, difficulty, flag, url, tags = [], hint = null }) {
  if (!title || !description || !difficulty || !flag || !url) return { error: "Semua field harus diisi." };
  if (typeof difficulty !== "number") return { error: "Difficulty harus berupa angka." };
  if (tags && !Array.isArray(tags)) return { error: "Tags harus berupa array." };
  if (hint && typeof hint !== "string") return { error: "Hint harus berupa string." };

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
