// backend\pages\api\setup.js
import supabaseAdmin from "@/lib/supabaseAdmin";
import { withCors } from "@/lib/utils/withCors";
import { createNewUser } from "@/lib/supabase/userHelpers";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  try {
    const {
      data: { users },
      error: authError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const adminExists = users.some((user) => user.user_metadata?.role === "admin");

    // === GET: Cek status setup ===
    if (req.method === "GET") {
      if (adminExists) {
        return res.status(200).json({ message: "Setup sudah dilakukan." });
      } else {
        return res.status(404).json({ message: "Setup belum dilakukan." });
      }
    }

    // === POST: Lakukan setup admin ===
    if (req.method === "POST") {
      if (adminExists) {
        return res.status(403).json({ message: "Setup sudah dilakukan. Tidak bisa membuat user admin lagi." });
      }

      const { email, password } = req.body;
      const name = "admin";
      const role = "admin";

      if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi." });
      }

      const result = await createNewUser({ name, email, password, role });
      if (result.error) return res.status(400).json({ message: result.error });

      return res.status(201).json({ message: "User admin berhasil dibuat!", user: result.data });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    return res.status(500).json({ message: "Terjadi kesalahan.", error: err.message });
  }
}
