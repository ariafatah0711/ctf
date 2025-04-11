import { deleteUser } from "@/lib/supabase";

export async function deleteUserById(id: string) {
  const { error } = await deleteUser(id);
  if (error) throw new Error(error.message);
  return true;
}