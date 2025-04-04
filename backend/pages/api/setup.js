// /backend/pages/api/auth/setup.js
import { hash } from "bcryptjs";
import supabase from "../../lib/supabase";

const setupSecret = process.env.SETUP_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password, secret } = req.body;

  if (secret !== setupSecret) {
    return res.status(401).json({ message: "Unauthorized: secret key salah." });
  }

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi." });
  }

  try {
    // Cek apakah sudah ada user
    const { data: existingUsers, error: fetchError } = await supabase.from("users").select("id").limit(1);

    if (fetchError) throw new Error(fetchError.message);

    if (existingUsers.length > 0) {
      return res.status(403).json({ message: "Setup sudah dilakukan. Tidak bisa membuat user root lagi." });
    }

    const hashedPassword = await hash(password, 10);

    const { data, error: insertError } = await supabase.from("users").insert([
      {
        username,
        email: `${username}@root.local`,
        password: hashedPassword,
        role: "admin",
      },
    ]);

    if (insertError) throw new Error(insertError.message);

    return res.status(201).json({ message: "User root berhasil dibuat!", data });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
  }
}
