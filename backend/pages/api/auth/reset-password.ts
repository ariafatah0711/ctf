import handler from "@/lib/handler";
import { resetPasswordByToken } from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token dan password wajib diisi" });
    }

    try {
      const { userId } = await resetPasswordByToken(token, newPassword);
      return res.status(200).json({ message: `Password berhasil diubah untuk ${userId}` });
    } catch (err) {
      return res.status(400).json({ message: err.message || "Terjadi kesalahan." });
    }
  });