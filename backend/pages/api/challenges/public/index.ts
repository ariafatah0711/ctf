import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/lib/handler";
import { getUserFromToken } from "@/lib/middleware/auth";
import { getUserClientChallenges, createClientChallenge } from "@/services/challenges_public";

export default handler()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await getUserClientChallenges(user.id);
    if (error) return res.status(500).json({ error });
    return res.status(200).json({ data });
  })

  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await createClientChallenge({ ...req.body, user_id: user.id });
    if (error) return res.status(400).json({ error });
    return res.status(201).json({ data });
  });
