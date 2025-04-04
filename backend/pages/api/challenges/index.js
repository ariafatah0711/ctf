// /backend/pages/api/chalanges/index.js
import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const { tags, difficulty, title } = req.query;

      // let query = supabase.from("challenges").select("id, title, description, difficulty, created_at, url, tags");
      let query = supabase.from("challenges").select("id, title, difficulty, created_at, tags");
      // Filter untuk tags
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query = query.contains("tags", tagArray);
      }

      // Filter untuk difficulty
      if (difficulty) {
        query = query.eq("difficulty", parseInt(difficulty));
      }

      // Filter untuk title
      if (title) {
        query = query.ilike("title", `%${title}%`);
      }

      console.log("Applied filters:", { tags, difficulty, title }); // Debugging log

      const { data, error } = await query;

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(200).json(data);
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

// GET /api/challenges?difficulty=2
// GET /api/challenges?tags=web
// GET /api/challenges?title=security
// GET /api/challenges?difficulty=2&tags=web
