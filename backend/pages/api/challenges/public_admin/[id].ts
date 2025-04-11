import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/lib/handler";
import {
  getClientChallengesAdmin,
  updateClientChallengeStatus,
  deleteClientChallengeByIdAdmin,
} from "@/services/challenges_public";
import { verifyToken, requireRole } from "@/lib/middleware/auth";

export default handler()
  .use(verifyToken)
  .use(requireRole(["admin", "maker"]))
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    const { data, error } = await getClientChallengesAdmin(id as string);
    if (error) return res.status(404).json({ error });

    return res.status(200).json({ data });
  })

  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const { reviewed, accepted } = req.body;

    const { data, error } = await updateClientChallengeStatus(id as string, {
      reviewed,
      accepted,
    });

    if (error) return res.status(400).json({ error });

    return res.status(200).json({ data });
  })

  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    const { success, error } = await deleteClientChallengeByIdAdmin(id as string);
    if (error) return res.status(500).json({ error });

    return res.status(200).json({ success });
  });