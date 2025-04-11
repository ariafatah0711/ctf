import { supabase } from "@/lib/supabase";

export async function updateClientChallengeStatus(id: string, payload: { reviewed?: boolean; accepted?: boolean }) {
  if (!("reviewed" in payload) && !("accepted" in payload)) {
    return { error: "Minimal satu dari reviewed atau accepted harus diisi." };
  }

  const updates: any = {};
  if ("accepted" in payload) updates.accepted = payload.accepted;
  if ("reviewed" in payload) updates.reviewed = payload.reviewed;

  const { data, error } = await supabase.from("client_challenges").update(updates).eq("id", id).select("*");

  if (error) return { error: error.message };
  return { data };
}