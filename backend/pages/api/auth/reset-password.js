import supabaseAdmin from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Token dan password wajib diisi" });

  // 🧠 Decode JWT (tanpa verify) ➜ ambil user ID
  const decoded = jwt.decode(token);
  if (!decoded?.sub) return res.status(400).json({ message: "Token tidak valid" });

  const userId = decoded.sub;

  const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (getUserError || !user) return res.status(404).json({ message: "User tidak ditemukan" });

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (updateError) return res.status(500).json({ message: `Gagal update password: ${updateError.message}` });
  return res.status(200).json({ message: `Password berhasil diubah untuk ${userId}` });
}
