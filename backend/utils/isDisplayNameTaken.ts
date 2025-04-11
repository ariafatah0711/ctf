import { supabaseAdmin } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export async function isDisplayNameTaken(name: string, excludeUserId: string | null = null): Promise<boolean> {
  if (!name) return true;

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Gagal mengambil data user:", error.message);
    return true;
  }

  return (
    data?.users.some((user: User) => {
      const isSameName = user.user_metadata?.display_name?.toLowerCase() === name.toLowerCase();
      const isDifferentUser = user.id !== excludeUserId;
      return isSameName && isDifferentUser;
    }) ?? false
  );
}
