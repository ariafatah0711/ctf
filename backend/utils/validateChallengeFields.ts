type ChallengeFields = {
  title?: string,
  description?: string,
  difficulty?: number,
  flag?: string,
  url?: string,
  tags?: string[],
  hint?: string,
};

export function validateChallengeFields({
  title,
  description,
  difficulty,
  flag,
  url,
  tags,
  hint,
}: ChallengeFields): string | null {
  if (!title || !description || difficulty === undefined || !flag || !url) {
    return "Semua field harus diisi.";
  }

  if (typeof difficulty !== "number") {
    return "Difficulty harus berupa angka.";
  }

  if (tags && !Array.isArray(tags)) {
    return "Tags harus berupa array.";
  }

  if (hint && typeof hint !== "string") {
    return "Hint harus berupa string.";
  }

  return null;
}
