import { supabase } from "@/lib/supabase";
import { encrypt, hashFlag } from "@/lib/encrypt";
import type { CreateChallengeInput, ChallengeResponse } from "@/types/challenge";

export async function createClientChallenge({
  user_id,
  title,
  description,
  difficulty,
  url,
  tags = [],
  hint = null,
  flag = null,
}: CreateChallengeInput): Promise<ChallengeResponse> {
  let encryptedFlag = null;
  let flagHash = null;
  if (flag) {
    encryptedFlag = encrypt(flag);
    flagHash = hashFlag(flag);
  }

  const { count, error: countError } = await supabase
    .from("client_challenges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (countError) return { error: countError.message };
  if (count >= 3) return { error: "Kamu hanya bisa membuat maksimal 3 challenge publik." };

  const { data: existing, error: titleError } = await supabase
    .from("client_challenges")
    .select("id")
    .eq("user_id", user_id)
    .eq("title", title)
    .maybeSingle();

  if (titleError) return { error: titleError.message };
  if (existing) return { error: "Kamu sudah punya challenge dengan judul yang sama." };

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
