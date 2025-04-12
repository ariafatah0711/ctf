// import { supabase } from "@/lib/supabase";
// import { encrypt, hashFlag } from "@/lib/encrypt";
// import type { UpdateChallengeInput } from "@/types/challenge";

// export async function updateClientChallenge(
//   id: string,
//   userId: string,
//   input: UpdateChallengeInput,
//   isAdmin = false
// ): Promise<{
//   data?: any;
//   error?: string;
// }> {
//   const { title, description, difficulty, url, tags = [], hint = null, flag = null } = input;

//   const updateFields: any = {
//     title,
//     description,
//     difficulty,
//     url,
//     tags,
//     hint,
//     ...(isAdmin ? {} : { reviewed: false }),
//   };

//   if (flag) {
//     updateFields.flag = encrypt(flag);
//     updateFields.flag_hash = hashFlag(flag);
//   }

//   const query = supabase.from("client_challenges").update(updateFields).eq("id", id);
//   if (!isAdmin) query.eq("user_id", userId);

//   const { data, error } = await query.select("*");
//   if (error) return { error: error.message };
//   return { data };
// }

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

  // Check if the challenge exists
  const { data: existingChallenge, error: existingChallengeError } = await supabase
    .from("client_challenges")
    .select("user_id, title")
    .eq("id", id)
    .maybeSingle();

  if (existingChallengeError) return { error: existingChallengeError.message };
  if (!existingChallenge) return { error: "Challenge not found" };

  // If user is not admin, ensure that the challenge title is unique to the user
  if (!isAdmin && existingChallenge.user_id !== userId) {
    return { error: "You can only update your own challenges" };
  }

  // Check if the title already exists for this user
  if (title !== existingChallenge.title) {
    const { data: existing, error: titleError } = await supabase
      .from("client_challenges")
      .select("id")
      .eq("user_id", userId)
      .eq("title", title)
      .maybeSingle();

    if (titleError) return { error: titleError.message };
    if (existing) return { error: "You already have a challenge with this title" };
  }

  // If the challenge's flag is being updated, update the encrypted flag and hash
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