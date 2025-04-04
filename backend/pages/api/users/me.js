// /api/user/me.js
import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  verifyToken(req, res, async () => {
    const user = req.user;
    return res.status(200).json({ user });
  });
}
