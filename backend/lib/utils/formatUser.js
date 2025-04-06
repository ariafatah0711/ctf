export function formatUser(user) {
  const meta = user.user_metadata || {};
  const name = meta.display_name || "Unknown";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

  return {
    id: user.id,
    name,
    email: user.email,
    role: meta.role || "user",
    lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never",
    avatar: `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`,
  };
}
