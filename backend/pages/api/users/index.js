// /backend/pages/api/users/index.js
import supabaseAdmin from "@/lib/supabaseAdmin";
import { verifyToken, requireRole } from "@/lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      verifyToken(req, res, async () => {
        await requireRole("admin")(req, res, async () => {
          const { page = 1, limit = 25 } = req.query;
          const pageNum = parseInt(page);
          const pageLimit = parseInt(limit);

          const { data, error } = await supabaseAdmin.auth.admin.listUsers({
            page: pageNum,
            perPage: pageLimit,
          });

          if (error) {
            return res.status(500).json({ message: "Gagal mengambil data pengguna.", error: error.message });
          }

          const members = data.users.map((user) => {
            const meta = user.user_metadata || {};
            return {
              id: user.id,
              name: meta.display_name || "Unknown",
              email: user.email,
              role: meta.role || "user",
              lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never",
              avatar: `https://i.pravatar.cc/150?u=${user.id}`,
            };
          });

          return res.status(200).json({
            message: "Data pengguna berhasil diambil.",
            data: members,
            page: pageNum,
            totalPages: data.total_pages ?? 1, // total_pages ada kalau pakai paginasi
            total: data.total ?? members.length,
          });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
