// /services/user/create.ts
import { createUser } from "@/lib/supabase";
import { isDisplayNameTaken } from "@/utils/isDisplayNameTaken";

interface CreateUserInput {
  email: string;
  password: string;
  username: string;
  role?: string;
}

export async function createNewUser({ email, password, username, role = "user" }: CreateUserInput) {
  if (!email || !password || !username)
    return { error: "Email, password, dan username wajib diisi." };

  if (await isDisplayNameTaken(username))
    return { error: "Username sudah digunakan." };

  const { data, error } = await createUser({
    email,
    password,
    user_metadata: {
      display_name: username,
      role,
    },
  });

  if (error) return { error: error.message };

  return {
    data: {
      id: data.user.id,
      email: data.user.email,
      username,
      role,
    },
  };
}