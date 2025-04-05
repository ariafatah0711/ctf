// /backend/pages/api/auth/register.js
import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password harus diisi." });
    }

    try {
      const { data, error } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username, // atau bisa pakai display_name kalau dari frontend
            role: "user",
          },
          // emailRedirectTo: "my-ctf-platform.vercel.app/login",
        },
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json({ message: "Registrasi berhasil", user: data.user });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
