// backend\pages\api\challenges\submit.js
import supabase from "../../../lib/supabase";
import { verifyToken } from "../../../lib/middleware/auth";
import { decrypt } from "../../../lib/encrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { flag } = req.body;

    if (!flag) {
      return res.status(400).json({ message: "Flag harus diisi." });
    }

    verifyToken(req, res, async () => {
      try {
        const userId = req.user.id;
        console.log("User ID:", userId);

        const { data: challenges } = await supabase.from("challenges").select("id, flag");

        const matched = challenges.find((ch) => decrypt(ch.flag) === flag);

        if (!matched) {
          return res.status(404).json({ message: "Flag salah." });
        }

        const { data: existingChallenge } = await supabase
          .from("user_challenges")
          .select("user_id, challenge_id")
          .eq("user_id", userId)
          .eq("challenge_id", matched.id)
          .single();

        if (existingChallenge) {
          return res.status(400).json({ message: "Challenge ini sudah diselesaikan oleh pengguna ini." });
        }

        const { error: insertError } = await supabase.from("user_challenges").insert([
          {
            user_id: userId,
            challenge_id: matched.id,
            completed_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          return res.status(500).json({ message: insertError.message });
        }

        return res.status(201).json({ message: "Challenge berhasil disubmit dan flag valid!" });
      } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
      }
    });
  } else {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }
}
