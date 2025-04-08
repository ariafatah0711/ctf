// backend\pages\api\users\auth.js
import { verifyToken } from "../../../lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  verifyToken(req, res, () => {
    const { user_metadata } = req.user;
    const username = user_metadata?.display_name || req.user.email;
    const role = user_metadata?.role || "user";
    const email = user_metadata?.email || "N/A";

    const initials = username
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");

    const avatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`;

    return res.status(200).json({
      user: {
        username,
        role,
        avatar,
        email,
      },
    });
  });
}
