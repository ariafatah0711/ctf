import supabase from "@/lib/supabase";
import supabaseAdmin from "../supabaseAdmin";
import { decrypt } from "../encrypt";

export async function getClientChallengesAdmin(id = null, { page = 1, limit = 25 } = {}) {
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  console.log("=== getClientChallengesAdmin called ===");

  let query = supabase
    .from("client_challenges")
    .select("*", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(from, to);

  if (id) query = query.eq("id", id);

  const { data: challenges, error, count } = await query;
  if (error) return { error: error.message };
  if (!challenges || !challenges.length) return { data: [], total: 0, totalPages: 0 };

  const userIds = [...new Set(challenges.map((c) => c.user_id).filter(Boolean))];
  const userMap = new Map();

  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(userId);
        const user = userData?.user;
        if (user) {
          userMap.set(userId.toLowerCase(), user);
        } else {
          userMap.set(userId.toLowerCase(), null);
        }
      } catch (err) {
        userMap.set(userId.toLowerCase(), null);
      }
    })
  );

  const enriched = challenges.map((c) => {
    const user = userMap.get(c.user_id?.toLowerCase?.());
    const username = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email || "Unknown User";
    return {
      ...c,
      flag: c.flag ? decrypt(c.flag) : null,
      username,
    };
  });

  return {
    data: enriched,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}

// UPDATE status review / approval
export async function updateClientChallengeStatus(id, payload) {
  if (!("reviewed" in payload) && !("accepted" in payload)) {
    return { error: "Minimal satu dari reviewed atau accepted harus diisi." };
  }

  const updates = {};
  if (Object.prototype.hasOwnProperty.call(payload, "accepted")) {
    updates.accepted = payload.accepted;
  }
  if (Object.prototype.hasOwnProperty.call(payload, "reviewed")) {
    updates.reviewed = payload.reviewed;
  }

  const { data, error } = await supabase.from("client_challenges").update(updates).eq("id", id).select("*");

  if (error) return { error: error.message };
  return { data };
}

// DELETE berdasarkan ID challenge
export async function deleteClientChallengeByIdAdmin(id) {
  const { error } = await supabase.from("client_challenges").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

// DELETE berdasarkan user_id
export async function deleteClientChallengesByUserAdmin(user_id) {
  const { error } = await supabase.from("client_challenges").delete().eq("user_id", user_id);
  if (error) return { error: error.message };
  return { success: true };
}

// CLEAR challenge yang lebih dari 7 hari (1 minggu)
export async function clearOldClientChallengesAdmin() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { error } = await supabase.from("client_challenges").delete().lt("submitted_at", oneWeekAgo.toISOString());

  if (error) return { error: error.message };
  return { success: true };
}
