import { getUser, updateUser } from "@/lib/supabase";
import { isDisplayNameTaken } from "@/utils/isDisplayNameTaken";

export async function updateCurrentUser(id: string, { name, email, password }) {
  if (!id) return { error: "ID user wajib diisi." };

  const { data: userData, error: getUserError } = await getUser(id);
  if (getUserError || !userData?.user) return { error: "User tidak ditemukan." };

  const currentUser = userData.user;
  const updateFields: any = {};
  const metaUpdate: any = {};
  const currentName = currentUser.user_metadata?.display_name;

  if (email && email !== currentUser.email) updateFields.email = email;
  if (password) updateFields.password = password;

  if (name && name !== currentName) {
    const taken = await isDisplayNameTaken(name, id);
    if (taken) return { error: "Username sudah digunakan." };
    metaUpdate.display_name = name;
  }

  if (Object.keys(updateFields).length === 0 && Object.keys(metaUpdate).length === 0) {
    return { error: "Tidak ada perubahan yang dilakukan." };
  }

  try {
    const data = await updateUser(id, {
      ...updateFields,
      user_metadata: {
        ...currentUser.user_metadata,
        ...metaUpdate,
      },
    });

    if (!data?.user) return { error: "Data user tidak valid setelah update." };

    return {
      message: "Data profil berhasil diperbarui.",
      user: {
        id: data.user.id,
        email: data.user.email,
        display_name: data.user.user_metadata?.display_name,
      },
    };
  } catch (err: any) {
    return { error: err.message || "Gagal memperbarui user." };
  }
}