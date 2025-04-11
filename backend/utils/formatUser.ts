// services/users/formatUser.ts
import type { User } from "@supabase/supabase-js";

interface FormattedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastSignIn: string;
  lastSignInTimestamp: number | null;
  avatar: string;
}

export function formatUser(user: User): FormattedUser {
  const meta = user.user_metadata || {};
  const name: string = meta.display_name || "Unknown";
  const initials: string = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  const rawDate = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

  return {
    id: user.id,
    name,
    email: user.email ?? "",
    role: meta.role || "user",
    lastSignIn: rawDate ? rawDate.toLocaleString() : "Never",
    lastSignInTimestamp: rawDate ? rawDate.getTime() : null,
    avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`,
  };
}
