import supabaseAdmin from "@/lib/supabaseAdmin";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token dan password wajib diisi" });

  const { data, error } = await supabaseAdmin.auth.updateUserById(token, {
    password: newPassword,
  });

  if (error) return res.status(500).json({ message: error.message || "Gagal update password" });

  return res.status(200).json({ message: "Password berhasil diubah" });
}
