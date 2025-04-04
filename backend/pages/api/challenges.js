// /backend/pages/api/challenges.js
import supabase from "../../lib/supabase";
import { verifyToken } from "../../lib/middleware/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const { data, error } = await supabase.from("challenges").select("id, title, description, difficulty, created_at, url");

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(200).json(data);
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
