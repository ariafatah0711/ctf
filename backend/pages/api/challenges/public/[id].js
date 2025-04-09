import { getUserFromToken } from "@/lib/auth";
import { getPublicChallengeById, updatePublicChallenge, deletePublicChallenge } from "@/lib/supabase/publicChallengesHelper";
import handler from "@/lib/handler";

export default handler()
  .get(async (req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const id = req.query.id;
    const { data, error } = await getPublicChallengeById(id, user);
    if (error) return res.status(404).json({ error });
    return res.status(200).json({ data });
  })

  .put(async (req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const id = req.query.id;
    const { data, error } = await updatePublicChallenge(id, { ...req.body, user_id: user.id });
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ data });
  })

  .delete(async (req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const id = req.query.id;
    const { data, error } = await deletePublicChallenge(id, user);
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ data });
  });
