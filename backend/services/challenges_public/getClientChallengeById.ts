import { supabase } from "@/lib/supabase";

export async function getClientChallengeById(id: string, userId: string, isAdmin = false) {
    let query = supabase
      .from("client_challenges")
      .select("*")
      .eq("id", id);

    if (!isAdmin) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { notFound: true, error: "Challenge tidak ditemukan." };
  
    return { data };
  }
  