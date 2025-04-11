// /backend/pages/api/auth/register.ts
import handler from "@/lib/handler";
import { registerUser } from "@/services/user/";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, email, password } = req.body;
    const role = "user"

    const result = await registerUser({ username, email, password, role });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: result.user,
    });
  }
);