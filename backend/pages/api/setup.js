// /backend/pages/api/auth/setup.js
import { hash } from "bcryptjs";
import supabase from "../../lib/supabase";

const setupSecret = process.env.SETUP_SECRET;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

  // if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
  //   return res
  //     .status(400)
  //     .json({ message: "Password harus mengandung setidaknya 8 karakter, satu huruf besar, satu angka, dan satu simbol." });
  // }

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
