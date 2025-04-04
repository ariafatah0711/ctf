// /backend/pages/api/chalanges/index.js
import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // if (req.method === "GET") {
  //   verifyToken(req, res, async () => {
  //     const { tags, difficulty, title } = req.query;

  //     // let query = supabase.from("challenges").select("id, title, description, difficulty, created_at, url, tags");
  //     let query = supabase.from("challenges").select("id, title, difficulty, created_at, tags");
  //     // Filter untuk tags
  //     if (tags) {
  //       const tagArray = Array.isArray(tags) ? tags : [tags];
  //       query = query.contains("tags", tagArray);
  //     }

  //     // Filter untuk difficulty
  //     if (difficulty) {
  //       query = query.eq("difficulty", parseInt(difficulty));
  //     }

  //     // Filter untuk title
  //     if (title) {
  //       query = query.ilike("title", `%${title}%`);
  //     }

  //     console.log("Applied filters:", { tags, difficulty, title }); // Debugging log

  //     const { data, error } = await query;

  //     if (error) {
  //       return res.status(500).json({ message: error.message });
  //     }

  //     return res.status(200).json(data);
  //   });
  if (req.method === "GET") {
    verifyToken(req, res, async () => {
      const userId = req.user.id;
      const { tags, difficulty, title } = req.query;

      if (!userId) {
        console.warn("❗ userId is undefined from token payload");
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Ambil relasi user_challenges via select
      let query = supabase.from("challenges").select(`
          id, title, difficulty, created_at, tags,
          user_challenges(challenge_id, user_id)
        `); // relasi user_challenges

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query = query.contains("tags", tagArray);
      }

      if (difficulty) {
        query = query.eq("difficulty", parseInt(difficulty));
      }

      if (title) {
        query = query.ilike("title", `%${title}%`);
      }

      const { data, error } = await query;

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const result = data.map((challenge) => ({
        ...challenge,
        solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
      }));

      // const result = data.map((challenge) => {
      //   console.log("DEBUG challenge.user_challenges:", challenge.user_challenges);
      //   return {
      //     ...challenge,
      //     solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
      //   };
      // });

      return res.status(200).json(result);
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

// GET /api/challenges?difficulty=2
// GET /api/challenges?tags=web
// GET /api/challenges?title=security
// GET /api/challenges?difficulty=2&tags=web
