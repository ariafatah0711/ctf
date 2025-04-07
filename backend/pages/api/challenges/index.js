// backend\pages\api\challenges\index.js
import { verifyToken, requireRole } from "../../../lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";
import { fetchChallengesWithFilters, createChallenge } from "@/lib/supabase/challengesHelper";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const userId = req.user.id;
      const filters = req.query;

      const result = await fetchChallengesWithFilters(userId, filters);

      if (result.error) {
        return res.status(500).json({ message: result.error });
      }

      return res.status(200).json(result);
    });
  }

  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const challenge = req.body;
        const result = await createChallenge(challenge);

        if (result.error) {
          return res.status(400).json({ message: result.error });
        }

        return res.status(201).json({ message: "Challenge berhasil ditambahkan!", data: result.data });
      });
    });
  }
}
