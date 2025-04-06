// backend\pages\api\challenges\submit.js
import { verifyToken } from "../../../lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";
import { submitChallenge } from "@/lib/supabase/challengesHelper";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "POST") {
    const { flag } = req.body;
    verifyToken(req, res, async () => {
      try {
        const userId = req.user.id;
        const result = await submitChallenge(userId, flag);

        if (result.error) return res.status(400).json({ message: result.error });

        return res.status(201).json({
          message: result.message,
          challengeId: result.challengeId,
        });
      } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
      }
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
