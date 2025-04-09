import { formatUser } from "./formatUser";
import supabaseAdmin from "@/lib/supabaseAdmin";

// export async function listFormattedUsers(page = 1, limit = 25) {
//   const pageNum = parseInt(page);
//   const pageLimit = parseInt(limit);

//   const { data, error } = await supabaseAdmin.auth.admin.listUsers({
//     page: pageNum,
//     perPage: pageLimit,
//   });

//   if (error) return { error: error.message };

//   const users = (data.users || []).map((user) => formatUser(user));

//   const totalPages = Math.ceil(data.total / pageLimit) || 1;

//   return {
//     data: users,
//     page: pageNum,
//     totalPages,
//     total: data.total ?? users.length,
//   };
// }

export async function listFormattedUsers(page = 1, limit = 25, role, lastSigninSort = "desc") {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) return { error: error.message };

  // sort role
  const roleOrder = {
    admin: 0,
    maker: 1,
    user: 2,
  };

  // Sort: yang ada lastSignIn dulu, baru yang null
  const sorted = (data.users || [])
    .filter((u) => !role || u.user_metadata?.role === role)
    .sort((a, b) => {
      const roleA = roleOrder[a.user_metadata?.role] ?? 99;
      const roleB = roleOrder[b.user_metadata?.role] ?? 99;

      if (roleA !== roleB) return roleA - roleB;

      const aSignIn = a.last_sign_in_at ? new Date(a.last_sign_in_at) : null;
      const bSignIn = b.last_sign_in_at ? new Date(b.last_sign_in_at) : null;

      if (!aSignIn && !bSignIn) return 0;
      if (!aSignIn) return 1;
      if (!bSignIn) return -1;

      return lastSigninSort === "asc" ? aSignIn - bSignIn : bSignIn - aSignIn;
    });

  const offset = (page - 1) * limit;
  const paginated = sorted.slice(offset, offset + limit);

  return {
    data: paginated.map(formatUser),
    page,
    total: sorted.length,
    totalPages: Math.ceil(sorted.length / limit),
  };
}
