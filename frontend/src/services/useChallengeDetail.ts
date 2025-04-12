import config from '@/config/env';

export const fetchChallengeDetail = async ({
  id,
  token,
  limit = 3,
  offset = 0,
}: {
  id: string;
  token: string;
  limit?: number;
  offset?: number;
}) => {
  const res = await fetch(`${config.BASE_URL}/api/challenges/${id}?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat challenge');
  }

  return {
    challenge: data.data.challenge,
    solvers: data.data.solvers,
    solved: data.data.solved,
  };
};

export const fetchMoreSolvers = async ({
  id,
  token,
  limit,
  offset,
}: {
  id: string;
  token: string;
  limit: number;
  offset: number;
}) => {
  const res = await fetch(`${config.BASE_URL}/api/challenges/${id}?limit=${limit}&offset=${offset}&appendOnly=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat solvers tambahan');
  }

  return data.solvers || [];
};
