import {
  getClientChallengesAdmin,
  deleteClientChallengesByUserAdmin,
  clearOldClientChallengesAdmin,
} from "@/lib/supabase/adminClientChallenges";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import handler from "@/lib/handler";

export default handler()
  .get(async (req, res) => {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { id, page = 1, limit = 25 } = req.query;

        const result = await getClientChallengesAdmin(id, {
          page: parseInt(page),
          limit: parseInt(limit),
        });

        if (result.error) return res.status(500).json({ error: result.error });

        return res.status(200).json(result);
      });
    });
  })

  .delete(async (req, res) => {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        // const user = await getUserFromToken(req);
        // if (!user || user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        const { user_id, clear_old } = req.query;

        if (clear_old === "true") {
          const { success, error } = await clearOldClientChallengesAdmin();
          if (error) return res.status(500).json({ error });
          return res.status(200).json({ success });
        }

        if (!user_id) return res.status(400).json({ error: "user_id dibutuhkan untuk penghapusan spesifik." });

        const { success, error } = await deleteClientChallengesByUserAdmin(user_id);
        if (error) return res.status(500).json({ error });

        return res.status(200).json({ success });
      });
    });
  });
