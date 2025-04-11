import handler from "@/lib/handler";
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import {
  getChallengeDetailWithSolvers,
  getChallengeWithFlagById,
  updateChallenge,
  updateChallengeActiveStatus,
  deleteChallengeById,
} from "@/services/challenges";
import { validate as validateUUID } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

export default handler()
  .use(verifyToken)
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, detail, appendOnly, limit, offset } = req.query;
    const userId = (req as any).user.id;

    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    if (detail === "true") {
      requireRole(["admin", "maker"])(req, res, async () => {
        const result = await getChallengeWithFlagById(id);
        if (result?.notFound) return res.status(404).json({ message: result.error });
        if (result?.error) return res.status(500).json({ message: result.error });

        return res.status(200).json(result);
      });
    } else {
      const result = await getChallengeDetailWithSolvers(
        id,
        userId,
        parseInt(limit as string) || 10,
        parseInt(offset as string) || 0,
        appendOnly === "true"
      );

      if (result?.notFound) return res.status(404).json({ message: result.error });
      if (result?.error) return res.status(500).json({ message: result.error });

      return res.status(200).json(result);
    }
  })
  .put(requireRole(["admin", "maker"]), async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    const {
      title,
      description,
      difficulty,
      flag,
      url,
      tags,
      hint,
      active,
      changeStatus,
    } = req.body;

    if (typeof changeStatus !== "undefined") {
      const result = await updateChallengeActiveStatus(id, changeStatus);
      if (result?.error) {
        return res.status(400).json({ message: result.error });
      }
      return res.status(200).json({ message: "Status challenge berhasil diperbarui!", data: result.data });
    }

    const result = await updateChallenge(id, {
      title,
      description,
      difficulty,
      flag,
      url,
      tags,
      hint,
      active,
    });

    if (result?.notFound) return res.status(404).json({ message: result.error });
    if (result?.error) return res.status(400).json({ message: result.error });

    return res.status(200).json({ message: "Challenge berhasil diperbarui!", data: result.data });
  })
  .delete(requireRole(["admin", "maker"]), async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    if (typeof id !== "string" || !validateUUID(id)) {
      return res.status(400).json({ message: "ID tidak valid atau bukan UUID." });
    }

    const result = await deleteChallengeById(id);

    if (result?.notFound) return res.status(404).json({ message: result.error });
    if (result?.error) return res.status(500).json({ message: result.error });

    return res.status(200).json({ message: "Challenge berhasil dihapus.", data: result.data });
  });