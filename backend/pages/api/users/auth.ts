import handler from "@/lib/handler";
import { verifyToken } from "@/lib/middleware/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .get((req: NextApiRequest, res: NextApiResponse) => {
    const { user_metadata } = req.user;
    const username = user_metadata?.display_name || req.user.email;
    const role = user_metadata?.role || "user";
    const email = req.user?.email || "N/A";

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
