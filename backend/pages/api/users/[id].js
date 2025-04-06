// /backend/pages/api/users/[id].js
import supabaseAdmin from "@/lib/supabaseAdmin";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";
import { formatUser } from "@/lib/utils/formatUser";
import { updateUserById, deleteUserById } from "@/lib/supabase/userHelpers";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "ID pengguna harus disediakan." });

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      await requireRole("admin")(req, res, async () => {
        try {
          const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

          if (error || !data?.user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
          }

          return res.status(200).json({
            message: "Data user berhasil diambil.",
            data: formatUser(data.user),
          });
        } catch (error) {
          return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
        }
      });
    });
  } else if (req.method === "PUT") {
    verifyToken(req, res, async () => {
      await requireRole("admin")(req, res, async () => {
        const { email, password, name, role } = req.body;

        try {
          const result = await updateUserById(id, { email, password, name, role });
          if (result.error) {
            return res.status(400).json({ message: "Gagal update user.", error: result.error });
          }

          return res.status(200).json({ message: "User berhasil diperbarui.", data: result });
        } catch (error) {
          return res.status(500).json({ message: "Gagal mengupdate user.", error: error.message });
        }
      });
    });
  } else if (req.method === "DELETE") {
    verifyToken(req, res, async () => {
      await requireRole("admin")(req, res, async () => {
        try {
          await deleteUserById(id);
          return res.status(200).json({ message: "User berhasil dihapus." });
        } catch (error) {
          return res.status(500).json({ message: "Gagal menghapus user.", error: error.message });
        }
      });
    });
  }
}
