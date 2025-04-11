import { supabase, supabaseAdmin } from "@/lib/supabase";
import { decrypt } from "@/lib/encrypt";

export async function getClientChallengesAdmin(id: string | null = null, { page = 1, limit = 25 } = {}) {
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  let query = supabase
    .from("client_challenges")
    .select("*", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(from, to);

  if (id) query = query.eq("id", id);

  const { data: challenges, error, count } = await query;
  if (error) return { error: error.message };
  if (!challenges?.length) return { data: [], total: 0, totalPages: 0 };

  const userIds = [...new Set(challenges.map((c) => c.user_id).filter(Boolean))];
  const userMap = new Map();

  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
        const user = userData?.user;
        userMap.set(userId.toLowerCase(), user || null);
      } catch {
        userMap.set(userId.toLowerCase(), null);
      }
    })
  );

  const enriched = challenges.map((c) => {
    const user = userMap.get(c.user_id?.toLowerCase?.());
    const username = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email || "Unknown User";
    return { ...c, flag: c.flag ? decrypt(c.flag) : null, username };
  });

  return { data: enriched, total: count, page, totalPages: Math.ceil(count / limit) };
}