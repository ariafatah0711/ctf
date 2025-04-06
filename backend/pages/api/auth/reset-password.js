// pages/api/reset-password.ts
import supabaseAdmin from "@/lib/supabase";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { token, newPassword } = req.body;

  if (!token || !newPassword) return res.status(400).json({ message: "Token dan password wajib diisi" });

  // 🔥 GUNAKAN ADMIN API UNTUK UPDATE PASSWORD DENGAN TOKEN
  const { data, error } = await supabaseAdmin.auth.api.updateUser(token, {
    password: newPassword,
  });

  if (error) return res.status(500).json({ message: error.message });

  return res.status(200).json({ message: "Password berhasil diubah" });
}
