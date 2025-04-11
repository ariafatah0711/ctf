import { loginUser as login } from "@/lib/supabase";

export async function loginUser({ email, password }) {
  if (!email || !password) return { error: "Email dan password wajib diisi." };

  const { data, error } = await login({ email, password });
  if (error) return { error: "Email atau password salah." };

  return {
    message: "Login berhasil",
    session: data.session,
    user: data.user,
  };
}