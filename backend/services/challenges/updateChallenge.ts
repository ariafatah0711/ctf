import { supabase } from "@/lib/supabase";
import { encrypt, hashFlag } from "@/lib/encrypt";
import { validateChallengeFields } from "@/utils/validateChallengeFields";
import { checkIfChallengeExists } from "@/utils/checkIfChallengeExists";

export async function updateChallenge(id: string, {
  title,
  description,
  difficulty,
  flag,
  url,
  tags = [],
  hint = null,
  active,
}: {
  title: string;
  description: string;
  difficulty: number;
  flag: string;
  url: string;
  tags?: string[];
  hint?: string | null;
  active: boolean;
}) {
  // Validasi input
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  // Cek apakah challenge-nya ada
  const { exists, error: findError } = await checkIfChallengeExists(id);
  if (findError) return { error: findError.message };
  if (!exists) return { error: "Challenge tidak ditemukan.", notFound: true };

  // Generate hash dari flag
  const flagHash = hashFlag(flag);

  // Cek apakah flag hash sudah dipakai oleh challenge lain
  const { data: existing, error: hashCheckError } = await supabase
    .from("challenges")
    .select("id")
    .eq("flag_hash", flagHash)
    .neq("id", id) // pastikan bukan challenge ini sendiri
    .maybeSingle();

  if (hashCheckError) return { error: hashCheckError.message };
  if (existing) return { error: "Flag sudah digunakan di challenge lain." };

  // Encrypt flag
  const encryptedFlag = encrypt(flag);

  // Update challenge
  const { data, error } = await supabase
    .from("challenges")
    .update({
      title,
      description,
      difficulty,
      flag: encryptedFlag,
      flag_hash: flagHash,
      url,
      tags,
      hint,
      active,
    })
    .eq("id", id)
    .select("*");

  if (error) return { error: error.message };
  return { data };
}
