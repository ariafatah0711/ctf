import { resetPassword } from "@/lib/supabase";

export async function forgotPassword(email: string) {
  if (!email) return { error: "Email wajib diisi" };

  const { error } = await resetPassword(email);

  if (error) return { error: error.message || "Gagal mengirim email reset password" };

  return {
    message: "Cek email kamu untuk reset password",
  };
}