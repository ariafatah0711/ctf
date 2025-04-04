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

export function requireRole(requiredRole) {
  return async function (req, res, next) {
    const user = req.user;
    const role = user?.user_metadata?.role;

    if (!role || role !== requiredRole) {
      return res.status(403).json({ message: "Akses ditolak. Role tidak sesuai." });
    }

    await next();
  };
}
