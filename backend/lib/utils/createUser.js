import supabaseAdmin from "@/lib/supabaseAdmin";
import { isDisplayNameTaken } from "./check";

export async function createNewUser({ name, email, password, role }) {
  if (!email || !password || !role || !name) {
    return { error: "Nama, email, password, dan role wajib diisi." };
  }

  if (await isDisplayNameTaken(name)) {
    return { error: "Username sudah digunakan." };
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      display_name: name,
      role,
    },
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    data: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}
