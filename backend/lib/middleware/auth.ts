import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

// Nambahin tipe user di request
interface RequestWithUser extends NextApiRequest {
  user?: any; // Ganti `any` kalau lo udah tahu struktur user Supabase
}

export async function verifyToken(
  req: RequestWithUser,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Token tidak ditemukan" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    res.status(401).json({ message: "Token tidak valid" });
    return;
  }

  req.user = data.user;
  next();
}

export function requireRole(requiredRoles: string[] | string) {
  return async function (
    req: RequestWithUser,
    res: NextApiResponse,
    next: () => void
  ): Promise<void> {
    const user = req.user;
    const role = user?.user_metadata?.role;

    const allowedRoles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];

    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({ message: "Akses ditolak. Role tidak sesuai." });
      return;
    }

    await next();
  };
}

export async function getUserFromToken(
  req: NextApiRequest
): Promise<any | null> {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") return null;
  
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) return null;

  return data.user;
}
