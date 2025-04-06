// backend/pages/api/challenges/[id].js
import { verifyToken, requireRole } from "@/lib/middleware/auth";
import { withCors } from "@/lib/utils/withCors";
import { validate as validateUUID } from "uuid";
import {
  getChallengeDetailWithSolvers,
  updateChallenge,
  deleteChallengeById,
  getChallengeWithFlagById,
} from "@/lib/supabase/challengesHelper";

// Fungsi untuk memvalidasi UUID
const isUUID = (str) => {
  return validateUUID(str);
};

export default async function handler(req, res) {
  if (withCors(req, res)) return;

  const { id, detail } = req.query;
  if (!id || typeof id !== "string" || id.length === 0) return res.status(400).json({ message: "ID tidak valid." });
  if (!isUUID(id)) return res.status(400).json({ message: "ID tidak dalam format UUID yang valid." });

  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      if (detail === "true") {
        requireRole(["admin", "maker"])(req, res, async () => {
          const result = await getChallengeWithFlagById(id);
          if (result?.notFound) return res.status(404).json({ message: result.error });
          if (result?.error) return res.status(500).json({ message: result.error });

          return res.status(200).json(result);
        });
      } else {
        const result = await getChallengeDetailWithSolvers(id);
        if (result?.notFound) return res.status(404).json({ message: result.error });
        if (result?.error) return res.status(500).json({ message: result.error });

        return res.status(200).json(result);
      }
    });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const { title, description, difficulty, flag, url, tags, hint } = req.body;
        const result = await updateChallenge(id, { title, description, difficulty, flag, url, tags, hint });

        if (result?.notFound) return res.status(404).json({ message: result.error });
        if (result?.error) return res.status(400).json({ message: result.error });

        return res.status(200).json({ message: "Challenge berhasil diperbarui!", data: result.data });
      });
    });
  } else if (req.method === "DELETE") {
    verifyToken(req, res, async () => {
      requireRole(["admin", "maker"])(req, res, async () => {
        const result = await deleteChallengeById(id);

        if (result?.notFound) return res.status(404).json({ message: result.error });
        if (result?.error) return res.status(500).json({ message: result.error });

        return res.status(200).json({ message: "Challenge berhasil dihapus.", data: result.data });
      });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
