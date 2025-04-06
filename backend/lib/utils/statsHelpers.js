export const mapUsersByRole = (users) => {
  return users.reduce(
    (acc, user) => {
      const role = user.user_metadata?.role ?? "Unknown";
      acc.user_role[role] = (acc.user_role[role] || 0) + 1;
      acc.total_role = Object.keys(acc.user_role).length;
      return acc;
    },
    { total_role: 0, user_role: {} }
  );
};

export const mapChallengesByDifficulty = (challenges) => {
  const diffMap = challenges.reduce((acc, { difficulty }) => {
    const level = difficulty?.toString() || "0";
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(diffMap).map(([level, count]) => ({ level, count }));
};

export const mapTagsDistribution = (challenges) => {
  const tagMap = {};
  challenges.forEach(({ tags }) => {
    tags?.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return Object.entries(tagMap).map(([tag, count]) => ({ tag, count }));
};
