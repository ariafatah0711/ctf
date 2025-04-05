import { verifyToken } from "../../../lib/middleware/auth";
import { verifySupabaseToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  verifySupabaseToken(req, res, () => {
    const { username, role } = req.user;
    return res.status(200).json({ user: { username, role } });
  });
}
