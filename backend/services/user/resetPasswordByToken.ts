// ✅ Tambahan fungsi di helpers
import { getUser, updateUser } from "@/lib/supabase";

export async function resetPasswordByToken(token: string, newPassword: string) {
  const jwt = await import("jsonwebtoken");
  const decoded = jwt.decode(token);

  if (!decoded?.sub) throw new Error("Token tidak valid");

  const userId = decoded.sub;

  const { data: user, error: getUserError } = await getUser(userId);
  if (getUserError || !user) throw new Error("User tidak ditemukan");

  try {
    const updated = await updateUser(userId, {
      password: newPassword,
    });
    // kalau perlu pakai updated di sini
  } catch (err: any) {
    throw new Error("Gagal update password: " + err.message);
  }

  return { userId };
}