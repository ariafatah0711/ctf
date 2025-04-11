import handler from "@/lib/handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { forgotPassword } from "@/services/user";

export default handler().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;

    const result = await forgotPassword(email);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  }
);
