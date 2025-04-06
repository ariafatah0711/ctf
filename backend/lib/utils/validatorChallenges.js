export function validateChallengeFields({ title, description, difficulty, flag, url, tags, hint }) {
  if (!title || !description || !difficulty || !flag || !url) {
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
