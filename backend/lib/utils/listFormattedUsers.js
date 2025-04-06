import { formatUser } from "./formatUser";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function listFormattedUsers(page = 1, limit = 25) {
  const pageNum = parseInt(page);
  const pageLimit = parseInt(limit);

  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: pageNum,
    perPage: pageLimit,
  });

  if (error) return { error: error.message };

  const users = (data.users || []).map((user) => formatUser(user));

  const totalPages = Math.ceil(data.total / pageLimit) || 1;

  return {
    data: users,
    page: pageNum,
    totalPages,
    total: data.total ?? users.length,
  };
}
