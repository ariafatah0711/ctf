// /backend/pages/api/auth/register.js
import { withCors } from "@/lib/utils/withCors";
import { createNewUser } from "@/lib/supabase/userHelpers";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "POST") {
    const { username, email, password } = req.body;
    const role = "user";

    try {
      const result = await createNewUser({ name: username, email, password, role });
      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      return res.status(201).json({ message: "Registrasi berhasil", user: result.user });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
