// import supabaseAdmin from "../../lib/supabase";
import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi." });
  }

  try {
    // Cek apakah sudah ada user dengan role "admin" di Supabase Auth
    const {
      data: { users },
      error: authError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    // Cek apakah ada user dengan role admin
    const adminExists = users.some((user) => user.user_metadata.role === "admin");

    if (adminExists) {
      return res.status(403).json({ message: "Setup sudah dilakukan. Tidak bisa membuat user admin lagi." });
    }

    // Membuat user admin dengan email dan password
    const { data: signupData, error: signupError } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: "admin",
          role: "admin",
        },
      },
    });

    if (signupError) throw signupError;

    return res.status(201).json({ message: "User admin berhasil dibuat!", user: signupData.user });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan.", error: err.message });
  }
}
