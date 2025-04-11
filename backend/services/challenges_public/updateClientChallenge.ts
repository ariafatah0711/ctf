import { supabase } from "@/lib/supabase";
import { encrypt, hashFlag } from "@/lib/encrypt";
import type { UpdateChallengeInput } from "@/types/challenge";

export async function updateClientChallenge(
  id: string,
  userId: string,
  input: UpdateChallengeInput,
  isAdmin = false
): Promise<{
  data?: any;
  error?: string;
}> {
  const { title, description, difficulty, url, tags = [], hint = null, flag = null } = input;

  const updateFields: any = {
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
