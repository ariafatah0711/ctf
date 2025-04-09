import { getUserClientChallenges, createClientChallenge } from "@/lib/supabase/clientChallengesHelper";
import { getUserFromToken } from "@/lib/middleware/auth";
import handler from "@/lib/handler";

export default handler()
  .get(async (req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await getUserClientChallenges(user.id);
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ data });
  })

  .post(async (req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await createClientChallenge({ ...req.body, user_id: user.id });
    if (error) return res.status(400).json({ error });
    return res.status(201).json({ data });
  });
