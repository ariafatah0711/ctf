import { reactive, computed, watch } from 'vue';
import useSWRV from 'swrv';
import config from '../config/env';
import { useAuthStore } from '../stores/auth';

// const CACHE_TTL = 5 * 60 * 1000; // 5 menit
const CACHE_TTL = config.CACHE_TTL
const PREFIX = 'history_cache_';
const data_history = reactive<Record<string, any>>({});

export function useHistoryData(page = 1, userId?: string) {
  const auth = useAuthStore();
  const cacheKey = `${PREFIX}page=${page}${userId ? `&userId=${userId}` : ''}`;

  const loadCache = () => {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    } catch (e) {
      console.warn('Gagal parse cache history:', e);
    }
    return null;
  };

  const saveCache = (data: any) => {
    const item = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));

    // Optional: bersihkan cache lama (max 10 item)
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => ({
        key: k,
        timestamp: (() => {
          try {
            const val = JSON.parse(localStorage.getItem(k) || '{}');
            return val.timestamp || 0;
          } catch {
            return 0;
          }
        })(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    const maxCache = 10;
    if (keys.length > maxCache) {
      keys.slice(0, keys.length - maxCache).forEach(item => {
        localStorage.removeItem(item.key);
      });
    }
  };

  const { data, error, isValidating, mutate } = useSWRV(
    cacheKey,
    async () => {
      const url = `${config.BASE_URL}/api/challenges/history?page=${page}&limit=15${userId ? `&userId=${userId}` : ''}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Gagal ambil history');
      saveCache(json.data || json);
      return json.data || json;
    },
    {
      ttl: CACHE_TTL,
      dedupingInterval: 2000,
      initialData: loadCache(),
    }
  );

  watch(data, (newData) => {
    if (newData) {
      data_history[cacheKey] = newData;
    }
  }, { immediate: true });

  return {
    data: computed(() => data_history[cacheKey]),
    error,
    isValidating,
    mutate,
  };
}