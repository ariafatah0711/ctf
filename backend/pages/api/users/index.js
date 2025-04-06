// /backend/pages/api/users/index.js
import { withCors } from "@/lib/utils/withCors";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { createNewUser } from "@/lib/supabase/userHelpers";
import { listFormattedUsers } from "@/lib/utils/listFormattedUsers";
import { getUserWithSolves } from "@/lib/supabase/getUserWithSolves";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "GET") {
    try {
      verifyToken(req, res, async () => {
        await requireRole("admin")(req, res, async () => {
          const { username, page = 1, limit = 25 } = req.query;

          // query by username?
          if (username) {
            const result = await getUserWithSolves(username);
            if (result.error)
              return res.status(404).json({ message: "User tidak ditemukan atau terjadi kesalahan.", error: result.error });
            return res.status(200).json({
              message: "Data user berhasil diambil.",
              data: result.data,
            });
          }

          const result = await listFormattedUsers(page, limit);

          if (result.error) {
            return res.status(500).json({ message: "Gagal mengambil data pengguna.", error: result.error });
          }

          return res.status(200).json({
            message: "Data pengguna berhasil diambil.",
            ...result,
          });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      verifyToken(req, res, async () => {
        await requireRole("admin")(req, res, async () => {
          const body = req.body;

          // Batch user
          if (Array.isArray(body.users)) {
            const createdUsers = [];
            const errors = [];

            for (const u of body.users) {
              const result = await createNewUser(u);
              if (result.error) {
                errors.push({ email: u.email, message: result.error });
              } else {
                createdUsers.push(result.data);
              }
            }

            return res.status(200).json({
              message: "Batch create finished.",
              success: createdUsers.length,
              failed: errors.length,
              errors,
              data: createdUsers,
            });
          }

          // Single user
          const result = await createNewUser(body);
          if (result.error) {
            return res.status(400).json({ message: result.error });
          }

          return res.status(201).json({
            message: "User berhasil ditambahkan.",
            data: result.data,
          });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan user.", error: error.message });
    }
  }
}
