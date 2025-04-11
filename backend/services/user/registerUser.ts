// /services/user/register.ts
import { isDisplayNameTaken } from "@/utils/isDisplayNameTaken";
import { createUser } from "@/lib/supabase";

export async function registerUser({ username, email, password, role = "user" }) {
  if (!email || !password || !role || !username)
    return { error: "Nama, email, password, dan role wajib diisi." };

  if (await isDisplayNameTaken(username))
    return { error: "Username sudah digunakan." };

  const { data, error } = await createUser({
    email,
    password,
    user_metadata: { display_name: username, role },
  });

  if (error) return { error: error.message };

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}