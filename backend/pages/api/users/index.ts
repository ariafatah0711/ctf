import handler from "@/lib/handler";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { listUsers, createNewUser, getUserWithSolves } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .get(
    async (req: NextApiRequest, res: NextApiResponse, next) => {
      const { username } = req.query;

      if (username) {
        const result = await getUserWithSolves(username as string);
        if (result.error) {
          return res.status(404).json({
            message: "User tidak ditemukan atau terjadi kesalahan.",
            error: result.error,
          });
        }

        return res.status(200).json({
          message: "Data user berhasil diambil.",
          data: result.data,
        });
      }

      return next?.();
    },
    requireRole("admin"),
    async (req: NextApiRequest, res: NextApiResponse) => {
      const { page = 1, limit = 25, role } = req.query;

      const result = await listUsers(Number(page), Number(limit), {
        filterRole: role as string,
        sortBy: "role",
      });

      if (result.error) {
        return res.status(500).json({
          message: "Gagal mengambil data pengguna.",
          error: result.error,
        });
      }

      return res.status(200).json({
        message: "Data pengguna berhasil diambil.",
        ...result,
      });
    }
  )
  .post(
    requireRole("admin"),
    async (req: NextApiRequest, res: NextApiResponse) => {
      const body = req.body;
  
      // Batch create users
      if (Array.isArray(body.users)) {
        const createdUsers = [];
        const errors = [];
  
        for (const u of body.users) {
          const mappedUser = {
            ...u,
            username: u.name, // mapping 'name' ke 'username'
          };
  
          const result = await createNewUser(mappedUser);
          if (result.error) {
            errors.push({ email: u.email, message: result.error });
          } else {
            createdUsers.push(result.data);
          }
        }
  
        return res.status(200).json({
          message: "Batch create selesai.",
          success: createdUsers.length,
          failed: errors.length,
          errors,
          data: createdUsers,
        });
      }
  
      // Single user creation
      const mappedBody = {
        ...body,
        username: body.name, // mapping 'name' ke 'username'
      };
  
      const result = await createNewUser(mappedBody);
      if (result.error) {
        return res.status(400).json({ message: result.error });
      }
  
      return res.status(201).json({
        message: "User berhasil ditambahkan.",
        data: result.data,
      });
    }
  )