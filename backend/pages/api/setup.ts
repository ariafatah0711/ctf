import handler from "@/lib/handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { createUser } from "@/lib/supabase";

export default handler()
  .get(async (_req: NextApiRequest, res: NextApiResponse) => {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return res.status(500).json({ message: "Gagal memuat pengguna.", error: error.message });
    }

    const adminExists = users.some((user) => user.user_metadata?.role === "admin");

    if (adminExists) {
      return res.status(200).json({ message: "Setup sudah dilakukan." });
    } else {
      return res.status(404).json({ message: "Setup belum dilakukan." });
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    const name = "admin";
    const role = "admin";

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi." });
    }

    // Cek apakah admin sudah ada
    const {
      data: { users },
      error: authError,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      return res.status(500).json({ message: "Gagal memuat pengguna.", error: authError.message });
    }

    const adminExists = users.some((user) => user.user_metadata?.role === "admin");
    if (adminExists) {
      return res.status(403).json({ message: "Setup sudah dilakukan. Tidak bisa membuat user admin lagi." });
    }

    // Buat user admin baru
    const result = await createUser({
      email,
      password,
      user_metadata: {
        display_name: name,
        role,
      },
    });
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({ message: "User admin berhasil dibuat!", user: result.data });
  });