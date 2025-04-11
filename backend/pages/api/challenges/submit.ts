// backend/pages/api/challenges/submit.ts
import handler from "@/lib/handler";
import { submitChallenge } from "@/services/challenges";
import { verifyToken } from "@/lib/middleware/auth";

export default handler()
  .use(verifyToken)
  .post(async (req, res) => {
    const { flag } = req.body;
    const userId = (req as any).user?.id;

    const result = await submitChallenge(userId, flag);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: result.message,
      challengeId: result.challengeId,
    });
});