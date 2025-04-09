// backend\pages\api\users\update-profile.js
import { verifyToken } from "@/lib/middleware/auth";
import { updateCurrentUser } from "@/lib/supabase/userHelpers";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  verifyToken(req, res, async () => {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    if (req.body.id && req.body.id !== userId) {
      return res.status(403).json({ error: "Kamu tidak punya akses ke user ini." });
    }

    const result = await updateCurrentUser(userId, { name, email, password });

    if (result.error) return res.status(400).json({ error: result.error });

    return res.status(200).json(result);
  });
}
