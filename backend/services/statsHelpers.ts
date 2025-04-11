type User = {
  user_metadata?: {
    role?: string;
  };
};

type Challenge = {
  difficulty?: number;
  tags?: string[];
};

export const mapUsersByRole = (users: User[]) => {
  return users.reduce(
    (acc: { total_role: number; user_role: Record<string, number> }, user) => {
      const role = user.user_metadata?.role ?? "Unknown";
      acc.user_role[role] = (acc.user_role[role] || 0) + 1;
      acc.total_role = Object.keys(acc.user_role).length;
      return acc;
    },
    { total_role: 0, user_role: {} }
  );
};

export const mapChallengesByDifficulty = (challenges: Challenge[]) => {
  const diffMap: Record<string, number> = challenges.reduce((acc, { difficulty }) => {
    const level = difficulty?.toString() || "0";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(diffMap).map(([level, count]) => ({ level, count }));
};

export const mapTagsDistribution = (challenges: Challenge[]) => {
  const tagMap: Record<string, number> = {};
  challenges.forEach(({ tags }) => {
    tags?.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return Object.entries(tagMap).map(([tag, count]) => ({ tag, count }));
};