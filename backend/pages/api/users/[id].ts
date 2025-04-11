// /backend/pages/api/users/[id].ts
import handler from "@/lib/handler";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { formatUser } from "@/utils/formatUser";
import { updateUserById, deleteUserById } from "@/services/user";
import { validate as validateUUID } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .use(requireRole(["admin"])) // cukup sekali di sini
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
    if (error || !data?.user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    return res.status(200).json({
      message: "Data user berhasil diambil.",
      data: formatUser(data.user),
    });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    const { email, password, name, role } = req.body;

    const result: any = await updateUserById(id, { email, password, name, role });
    if (result?.error) {
      return res.status(result.code === "weak_password" ? 422 : 400).json({
        message: "Gagal update user.",
        error: result.error,
      });
    }

    return res.status(200).json({ message: "User berhasil diperbarui.", data: result });
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    const result: any = await deleteUserById(id);

    if (result?.error) {
      return res.status(500).json({ message: "Gagal menghapus user.", error: result.error });
    }

    return res.status(200).json({ message: "User berhasil dihapus." });
  });