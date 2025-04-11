// /backend/pages/api/auth/login.ts
import handler from "@/lib/handler";
import { loginUser } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password }: { email?: string; password?: string } = req.body;

    const result = await loginUser({ email, password });

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    return res.status(200).json(result);
  }
);