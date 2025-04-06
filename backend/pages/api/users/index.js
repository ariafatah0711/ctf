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

          // const members = data.users.map((user) => {
          //   const meta = user.user_metadata || {};
          //   return {
          //     id: user.id,
          //     name: meta.display_name || "Unknown",
          //     email: user.email,
          //     role: meta.role || "user",
          //     lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never",
          //     avatar: `https://i.pravatar.cc/150?u=${user.id}`,
          //   };
          // });

          const members = data.users.map((user) => {
            const meta = user.user_metadata || {};
            const name = meta.display_name || "Unknown";
            const initials = name
              .split(" ")
              .filter((word) => word.length > 0) // filter kata kosong
              .map((word) => word[0]?.toUpperCase() || "") // aman dari undefined
              .join("");
            return {
              id: user.id,
              name,
              email: user.email,
              role: meta.role || "user",
              lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never",
              avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`, // Menggunakan UI Avatars API
            };
          });

          // Calculate totalPages manually
          const totalPages = Math.ceil(data.total / pageLimit) || 1;

          return res.status(200).json({
            message: "Data pengguna berhasil diambil.",
            data: members,
            page: pageNum,
            totalPages: totalPages, // Manually calculated total pages
            total: data.total ?? members.length,
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

          // Untuk batch (array of users)
          if (Array.isArray(body.users)) {
            const createdUsers = [];
            const errors = [];

            for (const u of body.users) {
              const { name, email, password, role } = u;
              if (!email || !password || !role || !name) {
                errors.push({ email, message: "Missing required fields." });
                continue;
              }

              const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                user_metadata: {
                  display_name: name,
                  role,
                },
                email_confirm: true,
              });

              if (error) {
                errors.push({ email, message: error.message });
              } else {
                createdUsers.push({
                  id: data.user.id,
                  email: data.user.email,
                });
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

          // Untuk single user
          const { name, email, password, role } = body;
          if (!email || !password || !role || !name) {
            return res.status(400).json({ message: "Nama, email, password, dan role wajib diisi." });
          }

          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: {
              display_name: name,
              role,
            },
            email_confirm: true,
          });

          if (error) {
            return res.status(500).json({ message: "Gagal menambahkan user.", error: error.message });
          }

          return res.status(201).json({
            message: "User berhasil ditambahkan.",
            data: {
              id: data.user.id,
              email: data.user.email,
            },
          });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan user.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
