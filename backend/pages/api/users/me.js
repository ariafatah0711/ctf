// // /api/user/me.js
// import { verifyToken } from "../../../lib/middleware/auth";

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   verifyToken(req, res, async () => {
//     const user = req.user;
//     return res.status(200).json({ user });
//   });
// }

import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  verifyToken(req, res, async () => {
    const userFromToken = req.user;

    // Ambil user dari database berdasarkan ID dari token
    const { data: user, error } = await supabase.from("users").select("id, username, role").eq("id", userFromToken.id).single();

    if (error || !user) {
      return res.status(403).json({ message: "User tidak ditemukan atau tidak valid.", error: error?.message });
    }

    // Validasi role dari database harus cocok dengan role di token
    if (user.role !== userFromToken.role) {
      return res.status(403).json({ message: "Role user tidak sesuai dengan token." });
    }

    return res.status(200).json({ user });
  });
}
