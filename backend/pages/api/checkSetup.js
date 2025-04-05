// checkSetup.js
import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

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
      return res.status(200).json({ message: "Setup sudah dilakukan." });
    } else {
      return res.status(404).json({ message: "Setup belum dilakukan." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan.", error: err.message });
  }
}
