// // /backend/pages/api/chalanges/index.js
// import supabase from "../../../lib/supabase";
// import { verifyToken } from "../../../lib/middleware/auth";

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
//   if (req.method === "GET") {
//     verifyToken(req, res, async () => {
//       const userId = req.user.id;
//       const { tags, difficulty, title, page = 1, limit = 9 } = req.query;

//       if (!userId) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }

//       let query = supabase
//         .from("challenges")
//         .select(
//           `
//           id, title, difficulty, created_at, tags,
//           user_challenges(challenge_id, user_id)
//         `,
//           { count: "exact" }
//         ) // ambil total count juga
//         .range((page - 1) * limit, page * limit - 1); // pagination

//       if (tags) {
//         const tagArray = Array.isArray(tags) ? tags : [tags];
//         query = query.contains("tags", tagArray);
//       }

//       if (difficulty) {
//         query = query.eq("difficulty", parseInt(difficulty));
//       }

//       if (title) {
//         query = query.ilike("title", `%${title}%`);
//       }

//       const { data, error, count } = await query;

//       if (error) {
//         return res.status(500).json({ message: error.message });
//       }

//       const result = data.map((challenge) => ({
//         ...challenge,
//         solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
//       }));

//       return res.status(200).json({
//         data: result,
//         total: count,
//         page: parseInt(page),
//         totalPages: Math.ceil(count / limit),
//       });
//     });
//   } else {
//     return res.status(405).json({ message: "Method not allowed" });
//   }
// }

// // GET /api/challenges?difficulty=2
// // GET /api/challenges?tags=web
// // GET /api/challenges?title=security
// // GET /api/challenges?difficulty=2&tags=web

import supabase from "@/lib/supabase";
import { verifySupabaseToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    verifySupabaseToken(req, res, async () => {
      const userId = req.user.id;
      const { tags, difficulty, title, page = 1, limit = 9 } = req.query;

      // if (!userId) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

      let query = supabase
        .from("challenges")
        .select(
          `
          id, title, difficulty, created_at, tags,
          user_challenges(challenge_id, user_id)
        `,
          { count: "exact" }
        )
        .range((page - 1) * limit, page * limit - 1);

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

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const result = data.map((challenge) => ({
        ...challenge,
        solved: challenge.user_challenges?.some((uc) => uc.user_id === userId) ?? false,
      }));

      return res.status(200).json({
        data: result,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
