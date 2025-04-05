// // /lib/middleware/auth.js
// import jwt from "jsonwebtoken";

// export function verifyToken(req, res, next) {
//   const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header Authorization

//   if (!token) {
//     return res.status(403).json({ message: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid or expired token" });
//     }
//     req.user = decoded; // Menyimpan decoded token ke request untuk digunakan di handler berikutnya
//     next();
//   });
// }

// export function requireRole(allowedRoles) {
//   return (req, res, next) => {
//     const userRole = req.user?.role;

//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     next();
//   };
// }

import supabaseAdmin from "../supabaseAdmin";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  req.user = data.user;
  next();
}
