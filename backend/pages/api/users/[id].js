// /backend/pages/api/users/[id].js
import supabaseAdmin from "@/lib/supabaseAdmin";
import { verifyToken, requireRole } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID pengguna harus disediakan." });
  }

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      await requireRole("admin")(req, res, async () => {
        try {
          const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

          if (error || !data?.user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
          }

          const user = data.user;
          const meta = user.user_metadata || {};

          return res.status(200).json({
            message: "Data user berhasil diambil.",
            data: {
              id: user.id,
              name: meta.display_name || "Unknown",
              email: user.email,
              role: meta.role || "user",
              lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never",
              avatar: `https://i.pravatar.cc/150?u=${user.id}`,
            },
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

        if (role && !["user", "admin", "maker"].includes(role)) {
          return res.status(400).json({ message: "Role tidak valid. Hanya boleh: user, admin, maker." });
        }

        console.log("PUT update request:", {
          email,
          password,
          name,
          role,
          from: req.user?.email,
          roleUser: req.user?.user_metadata?.role,
        });

        try {
          const updateFields = {};
          const metaUpdate = {};

          if (email) updateFields.email = email;
          if (password) updateFields.password = password;
          if (name) metaUpdate.display_name = name;
          if (role) metaUpdate.role = role;

          if (Object.keys(updateFields).length === 0 && Object.keys(metaUpdate).length === 0) {
            return res.status(400).json({ message: "Tidak ada data yang diperbarui." });
          }

          const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
            ...updateFields,
            user_metadata: metaUpdate,
          });

          if (error) {
            return res.status(500).json({ message: "Gagal mengupdate user.", error: error.message });
          }

          return res.status(200).json({ message: "User berhasil diperbarui.", data });
        } catch (error) {
          return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
        }
      });
    });
  } else if (req.method === "DELETE") {
    verifyToken(req, res, async () => {
      await requireRole("admin")(req, res, async () => {
        try {
          const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

          if (error) {
            return res.status(500).json({ message: "Gagal menghapus user.", error: error.message });
          }

          return res.status(200).json({ message: "User berhasil dihapus." });
        } catch (error) {
          return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
        }
      });
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
