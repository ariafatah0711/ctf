import supabaseAdmin from "@/lib/supabaseAdmin";
import { isDisplayNameTaken } from "@/lib/supabase/helpers/isDisplayNameTaken";

export async function createNewUser({ name, email, password, role }) {
  if (!email || !password || !role || !name) return { error: "Nama, email, password, dan role wajib diisi." };

  if (await isDisplayNameTaken(name)) return { error: "Username sudah digunakan." };

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      display_name: name,
      role,
    },
    email_confirm: true,
  });

  if (error) return { error: error.message };

  return {
    data: {
      id: data.user.id,
      email: data.user.email,
    },
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) return { error: "Email atau password salah." };

    return {
      message: "Login berhasil",
      session: data.session,
      user: data.user,
    };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat login." };
  }
}

export async function updateUserById(id, { email, password, name, role }) {
  const updateFields = {};
  const metaUpdate = {};

  // Ambil data user lama dulu
  const { data: existingUserData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(id);
  if (getUserError || !existingUserData?.user) return { error: "User tidak ditemukan." };
  const currentName = existingUserData.user.user_metadata?.display_name;

  if (email) updateFields.email = email;
  if (password) updateFields.password = password;
  if (name) metaUpdate.display_name = name;
  if (role) metaUpdate.role = role;

  if (Object.keys(updateFields).length === 0 && Object.keys(metaUpdate).length === 0) {
    throw new Error("Tidak ada data yang diperbarui.");
  }

  if (name && name !== currentName) {
    const taken = await isDisplayNameTaken(name, id);
    if (taken) return { error: "Username sudah digunakan." };
    metaUpdate.display_name = name;
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    ...updateFields,
    user_metadata: metaUpdate,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteUserById(id) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  return true;
}
