import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import config from '../config/env'
import { useAuthStore } from '../stores/auth'

const CACHE_KEY = 'dashboard_stats_cache'
const CACHE_TTL = config.CACHE_TTL

const loadCachedData = () => {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data
    }
  } catch (e) {
    console.warn('Cache parsing error:', e)
  }
  return null
}

const saveToCache = (data: any) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data,
  }))
}

export const useDashboardData = () => {
  const auth = useAuthStore()
  const localCache = ref(loadCachedData())

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${auth.user.token}` },
    })
    const json = await res.json()
    saveToCache(json)
    return json
  }

  const { data: swrvData } = useSWRV(
    () => `${config.BASE_URL}/api/stats`,
    fetcher,
    {
      ttl: CACHE_TTL,
      dedupingInterval: 2000,
    }
  )

  const data = computed(() => swrvData.value || localCache.value)

  return {
    data,
    swrvData, // kalau mau akses asli
  }
}
