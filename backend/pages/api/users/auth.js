// import { verifyToken } from "../../../lib/middleware/auth";

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   verifyToken(req, res, () => {
//     const { user_metadata } = req.user;
//     const username = user_metadata?.display_name || req.user.email;
//     const role = user_metadata?.role || "authenticated";

//     return res.status(200).json({ user: { username, role } });
//   });
// }

import { verifyToken } from "../../../lib/middleware/auth";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  verifyToken(req, res, () => {
    const { user_metadata } = req.user;
    const username = user_metadata?.display_name || req.user.email;
    const role = user_metadata?.role || "authenticated";

    // Membuat inisial dari nama pengguna
    const initials = username
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");

    // Menghasilkan URL untuk avatar berdasarkan inisial
    const avatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`;

    return res.status(200).json({
      user: {
        username,
        role,
        avatar, // Menambahkan avatar ke dalam response
      },
    });
  });
}
