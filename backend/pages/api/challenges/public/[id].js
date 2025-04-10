import { getClientChallengeById, updateClientChallenge, deleteClientChallenge } from "@/lib/supabase/clientChallengesHelper";
import { verifyToken, getUserFromToken } from "@/lib/middleware/auth";
import handler from "@/lib/handler";

export default handler()
  .get(async (req, res) => {
    verifyToken(req, res, async () => {
      const user = await getUserFromToken(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const id = req.query.id;
      const { data, error } = await getClientChallengeById(id, user.id);
      if (error) return res.status(404).json({ error });
      return res.status(200).json({ data });
    });
  })

  .put(async (req, res) => {
    verifyToken(req, res, async () => {
      const user = await getUserFromToken(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const id = req.query.id;
      const { data, error } = await updateClientChallenge(id, user.id, req.body);
      if (error) return res.status(400).json({ error });
      return res.status(200).json({ data });
    });
  })

  .delete(async (req, res) => {
    verifyToken(req, res, async () => {
      const user = await getUserFromToken(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      const id = req.query.id;
      const { error } = await deleteClientChallenge(id, user.id);
      if (error) return res.status(400).json({ error });
      return res.status(200).json({ success: true });
    });
  });
