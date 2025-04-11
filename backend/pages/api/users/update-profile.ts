// backend/pages/api/users/update-profile.ts
import handler from "@/lib/handler";
import { verifyToken } from "@/lib/middleware/auth";
import { updateCurrentUser } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = (req as any).user?.id;
    const { name, email, password } = req.body;

    if (req.body.id && req.body.id !== userId) {
      return res.status(403).json({ error: "Kamu tidak punya akses ke user ini." });
    }

    const result = await updateCurrentUser(userId, { name, email, password });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result);
  });