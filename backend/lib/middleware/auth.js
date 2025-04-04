// /lib/middleware/auth.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Ambil token dari header Authorization

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Menyimpan decoded token ke request untuk digunakan di handler berikutnya
    next();
  });
}

// export function requireRole(requiredRole) {
//   return (req, res, next) => {
//     if (!req.user || req.user.role !== requiredRole) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// }

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}
