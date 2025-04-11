// lib/supabase/helpers/users
import { supabaseAdmin } from "@/lib/supabase";

export async function createUser({ email, password, user_metadata }) {
  return await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata,
    email_confirm: true,
  });
}

export async function deleteUser(id) {
    return await supabaseAdmin.auth.admin.deleteUser(id);
}

export async function getUser(id) {
    return await supabaseAdmin.auth.admin.getUserById(id);
}

export async function loginUser({ email, password }) {
    return await supabaseAdmin.auth.signInWithPassword({ email, password });
}

export async function updateUser(id: string, updateData: any) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
  if (error) {
    throw error; // << ini yang bikin bisa auto error handling di luar
  }
  return data;
}

export async function resetPassword(email: string, redirectTo?: string) {
  return await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${process.env.BASE_URL}/#/`,
  });
}