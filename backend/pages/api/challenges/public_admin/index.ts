import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/lib/handler";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import {
  getClientChallengesAdmin,
  deleteClientChallengesByUserAdmin,
  clearOldClientChallengesAdmin,
} from "@/services/challenges_public";

export default handler()
  .use(verifyToken)
  .use(requireRole(["admin", "maker"]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, page = "1", limit = "25" } = req.query;

    const result = await getClientChallengesAdmin(id as string, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    if (result.error) return res.status(500).json({ error: result.error });

    return res.status(200).json(result);
  })

  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const { user_id, clear_old } = req.query;

    if (clear_old === "true") {
      const { success, error } = await clearOldClientChallengesAdmin();
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ success });
    }

    if (!user_id) {
      return res.status(400).json({
        error: "user_id dibutuhkan untuk penghapusan spesifik.",
      });
    }

    const { success, error } = await deleteClientChallengesByUserAdmin(user_id as string);
    if (error) return res.status(500).json({ error });

    return res.status(200).json({ success });
  });
