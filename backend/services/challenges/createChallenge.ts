// services/challenges/createChallenge.ts
import { supabase } from "@/lib/supabase";
import { encrypt, hashFlag } from "@/lib/encrypt";
import { validateChallengeFields } from "@/utils/validateChallengeFields";

export async function createChallenge({
  title,
  description,
  difficulty,
  flag,
  url,
  tags = [],
  hint = null,
  active = true,
}: {
  title: string;
  description: string;
  difficulty: number;
  flag: string;
  url: string;
  tags?: string[];
  hint?: string | null;
  active?: boolean;
}) {
  // Validasi dasar
  const errorMessage = validateChallengeFields({ title, description, difficulty, flag, url, tags, hint });
  if (errorMessage) return { error: errorMessage };

  const encryptedFlag = encrypt(flag);
  const flagHash = hashFlag(flag);

  // Cek apakah flag_hash sudah digunakan sebelumnya
  const { data: existingFlag, error: checkError } = await supabase
    .from("challenges")
    .select("id")
    .eq("flag_hash", flagHash)
    .maybeSingle();

  if (checkError) return { error: "Gagal memeriksa duplikat flag." };
  if (existingFlag) return { error: "Flag sudah digunakan di challenge lain. Gunakan flag yang berbeda." };

  // Insert challenge jika flag belum digunakan
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
        active,
      },
    ])
    .select("*");

  if (error) return { error: error.message };
  return { data };
}
