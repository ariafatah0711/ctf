// services/challenges/submitChallenge.ts
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encrypt";

export async function submitChallenge(userId: string, flag: string) {
  if (!flag) return { error: "Flag harus diisi." };

  const { data: challenges, error: challengeFetchError } = await supabase
    .from("challenges")
    .select("id, flag")
    .eq("active", true);

  if (challengeFetchError) return { error: "Gagal mengambil daftar challenge." };

  const matched = challenges?.find((ch) => decrypt(ch.flag) === flag);
  if (!matched) return { error: "Flag salah." };

  const { data: existingChallenge, error: existingError } = await supabase
    .from("user_challenges")
    .select("user_id, challenge_id")
    .eq("user_id", userId)
    .eq("challenge_id", matched.id)
    .single();

  if (existingError && existingError.code !== "PGRST116")
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
