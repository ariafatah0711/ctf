// services/historyService.ts
import config from '../config/env';

export const getChallengeHistory = async ({
  token,
  page = 1,
  limit = 15,
  userId,
}: {
  token: string;
  page?: number;
  limit?: number;
  userId?: string | string[];
}) => {
  let url = `${config.BASE_URL}/api/challenges/history?page=${page}&limit=${limit}`;
  if (userId) {
    url += `&userId=${userId}`;
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Gagal memuat riwayat tantangan');
  }

  return data.data || data;
};
