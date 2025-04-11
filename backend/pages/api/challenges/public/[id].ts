import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/lib/handler";
import { getClientChallengeById, updateClientChallenge, deleteClientChallenge } from "@/services/challenges_public";
import { verifyToken, getUserFromToken } from "@/lib/middleware/auth";

export default handler()
  .use(verifyToken)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { data, error } = await getClientChallengeById(id, user.id);
    if (error) return res.status(404).json({ error });
    return res.status(200).json({ data });
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { data, error } = await updateClientChallenge(id, user.id, req.body);
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ data });
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const { error } = await deleteClientChallenge(id, user.id);
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ success: true });
  });