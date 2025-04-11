// backend/pages/api/challenges/index.ts
import handler from "@/lib/handler";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { fetchChallengesWithFilters, createChallenge } from "@/services/challenges";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = (req as any).user.id;
    const filters = req.query;

    const result = await fetchChallengesWithFilters(userId, filters);

    if (result.error) {
      return res.status(500).json({ message: result.error });
    }

    return res.status(200).json(result);
  })
  .post(
    requireRole(["admin", "maker"]), // ← hanya berlaku untuk POST
    async (req: NextApiRequest, res: NextApiResponse) => {
      const challenge = req.body;
      const result = await createChallenge(challenge);

      if (result.error) {
        return res.status(400).json({ message: result.error });
      }

      return res
        .status(201)
        .json({ message: "Challenge berhasil ditambahkan!", data: result.data });
    }
  );