import { supabaseAdmin } from "@/lib/supabase";

export async function isEmailTaken(email: string, currentUserId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000, // asumsi user < 1000
  });

  if (error) {
    console.error("Gagal mengambil data user:", error);
    return false;
  }

  return data.users.some(
    (user) => user.email === email && user.id !== currentUserId
  );
}
