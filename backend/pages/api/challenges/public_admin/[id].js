import {
  getClientChallengesAdmin,
  updateClientChallengeStatus,
  deleteClientChallengeByIdAdmin,
} from "@/lib/supabase/adminClientChallenges";
import { verifyToken, getUserFromToken, requireRole } from "@/lib/middleware/auth";
import handler from "@/lib/handler";

export default handler()
  .get(async (req, res) => {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { id } = req.query;
        const { data, error } = await getClientChallengesAdmin(id);
        if (error) return res.status(404).json({ error });

        return res.status(200).json({ data });
      });
    });
  })

  .put(async (req, res) => {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { id } = req.query;
        const { reviewed, accepted } = req.body;

        const { data, error } = await updateClientChallengeStatus(id, { reviewed, accepted });
        if (error) return res.status(400).json({ error });

        return res.status(200).json({ data });
      });
    });
  })

  .delete(async (req, res) => {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { id } = req.query;

        const { success, error } = await deleteClientChallengeByIdAdmin(id);
        if (error) return res.status(500).json({ error });

        return res.status(200).json({ success });
      });
    });
  });
