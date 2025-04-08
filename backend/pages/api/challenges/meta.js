import { getChallengeMetadata } from "@/lib/supabase/challengesHelper";
import { withCors } from "@/lib/utils/withCors";

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== "GET") return res.status(405).end();

  const result = await getChallengeMetadata();
  if (result.error) return res.status(500).json({ message: result.error });

  return res.status(200).json(result);
}
