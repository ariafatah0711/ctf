import supabaseAdmin from "@/lib/supabaseAdmin";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email wajib diisi" });

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.BASE_URL}/#/`,
  });

  if (error) return res.status(500).json({ message: error.message || "Gagal mengirim email reset password" });
  return res.status(200).json({ message: "Cek email kamu untuk reset password" });
}
