import { getUser, updateUser } from "@/lib/supabase";
import { isDisplayNameTaken } from "@/utils/isDisplayNameTaken";
import { isEmailTaken } from "@/utils/isEmailTaken"; // kamu harus buat ini

export async function updateUserById(id, { email, password, name, role }) {
  const updateFields: any = {};
  const metaUpdate: any = {};

  const { data: existingUserData, error: getUserError } = await getUser(id);
  if (getUserError || !existingUserData?.user) return { error: "User tidak ditemukan." };

  const currentName = existingUserData.user.user_metadata?.display_name;
  const currentEmail = existingUserData.user.email;

  if (email && email !== currentEmail) {
    const taken = await isEmailTaken(email, id);
    if (taken) return { error: "Email sudah digunakan." };
    updateFields.email = email;
  }

  if (password) updateFields.password = password;
  if (role) metaUpdate.role = role;

  if (name && name !== currentName) {
    const taken = await isDisplayNameTaken(name, id);
    if (taken) return { error: "Username sudah digunakan." };
    metaUpdate.display_name = name;
  }

  if (Object.keys(updateFields).length === 0 && Object.keys(metaUpdate).length === 0) {
    return { error: "Tidak ada data yang diperbarui." };
  }

  try {
    const data = await updateUser(id, {
      ...updateFields,
      user_metadata: metaUpdate,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Supabase updateUser error:", error);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
}