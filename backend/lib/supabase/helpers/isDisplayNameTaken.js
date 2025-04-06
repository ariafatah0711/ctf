import supabaseAdmin from "@/lib/supabaseAdmin";

// export async function isDisplayNameTaken(name) {
//   if (!name) return true;
//   const { data: dataUsers, error } = await supabaseAdmin.auth.admin.listUsers();

//   if (error) {
//     console.error("Gagal mengambil data user:", error.message);
//     return true;
//   }

//   return dataUsers.users.some((user) => user.user_metadata?.display_name?.toLowerCase() === name.toLowerCase());
// }

export async function isDisplayNameTaken(name, excludeUserId = null) {
  if (!name) return true;

  const { data: dataUsers, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Gagal mengambil data user:", error.message);
    return true;
  }

  return dataUsers.users.some((user) => {
    const isSameName = user.user_metadata?.display_name?.toLowerCase() === name.toLowerCase();
    const isDifferentUser = user.id !== excludeUserId;
    return isSameName && isDifferentUser;
  });
}
