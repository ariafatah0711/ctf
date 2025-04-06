// import supabase from "@/lib/supabase";
import { withCors } from "@/lib/utils/withCors";
import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ message: "Email atau password salah.", error: error.message });
      }

      return res.status(200).json({
        message: "Login berhasil",
        session: data.session, // berisi access_token, refresh_token
        user: data.user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
