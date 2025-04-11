// services/users/listUsers.ts
import { formatUser } from "@/utils/formatUser";
import { supabaseAdmin } from "@/lib/supabase";

export async function listUsers(
  page: number = 1,
  limit: number = 25,
  options: { sortBy?: string; filterRole?: string | null } = { sortBy: "role", filterRole: null }
): Promise<{
  data?: ReturnType<typeof formatUser>[];
  page: number;
  total: number;
  totalPages: number;
  error?: string;
}> {
  const { sortBy = "role", filterRole = null } = options;

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage: limit,
  });

  if (error) return { error: error.message, page, total: 0, totalPages: 0 };

  let users = data.users || [];

  // 🔍 Filter berdasarkan role (opsional)
  if (filterRole) {
    users = users.filter((u) => u.user_metadata?.role === filterRole);
  }

  // 🔃 Sort berdasarkan pilihan
  if (sortBy === "role") {
    const roleOrder: Record<string, number> = {
      admin: 0,
      maker: 1,
      user: 2,
    };
    users.sort((a, b) => {
      const roleA = roleOrder[a.user_metadata?.role ?? ""] ?? 99;
      const roleB = roleOrder[b.user_metadata?.role ?? ""] ?? 99;

      if (roleA !== roleB) return roleA - roleB;

      const timeA = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : -Infinity;
      const timeB = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : -Infinity;
      return timeB - timeA;
    });
  }

  return {
    data: users.map(formatUser),
    page,
    total: (data as any)?.total ?? users.length,
    totalPages: Math.ceil(((data as any)?.total ?? users.length) / limit),
  };
}