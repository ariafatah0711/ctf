// services/useChallengeDetail.ts
import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import config from '../config/env'
import { useAuthStore } from '../stores/auth'

const CACHE_TTL = config.CACHE_TTL
const PREFIX = 'challenge_cache_'
const MAX_CACHE = 10

const getCacheKey = (id: string) => `${PREFIX}${id}`

const loadCache = (id: string) => {
  const raw = localStorage.getItem(getCacheKey(id))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data
    }
  } catch (e) {
    console.warn('Gagal parse cache challenge:', e)
  }
  return null
}

const saveCache = (id: string, data: any) => {
  const timestamp = Date.now()
  const item = { timestamp, data }
  localStorage.setItem(getCacheKey(id), JSON.stringify(item))

  // Bersihkan cache kalau lebih dari batas
  const keys = Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .map(k => ({
      key: k,
      timestamp: (() => {
        try {
          const val = JSON.parse(localStorage.getItem(k) || '{}')
          return val.timestamp || 0
        } catch {
          return 0
        }
      })()
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  if (keys.length > MAX_CACHE) {
    const toDelete = keys.slice(0, keys.length - MAX_CACHE)
    toDelete.forEach(item => localStorage.removeItem(item.key))
  }
}

export const useChallengeDetail = (id: string, initialLimit = 3) => {
  const auth = useAuthStore()
  const localCache = ref(loadCache(id))

  const fetcher = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(`${config.BASE_URL}/api/challenges/${id}?limit=${initialLimit}&offset=0`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) throw new Error('Fetch failed')

    const json = await res.json()
    const result = {
      challenge: json.data.challenge,
      solvers: json.data.solvers,
      solved: json.data.solved,
    }

    saveCache(id, result)
    return result
  }

  const { data: swrvData, isValidating, mutate, error } = useSWRV(
    () => `${config.BASE_URL}/api/challenges/${id}?limit=${initialLimit}&offset=0`,
    fetcher,
    {
      ttl: CACHE_TTL,
      dedupingInterval: 2000,
      initialData: localCache.value,
    }
  )

  const data = computed(() => swrvData.value || localCache.value)

  return {
    data,
    isValidating,
    error,
    mutate, // bisa dipanggil manual kalau perlu refresh
  }
}

export const loadMoreChallengeSolvers = async (id: string, offset: number, limit: number) => {
  const auth = useAuthStore()
  const res = await fetch(`${config.BASE_URL}/api/challenges/${id}?limit=${limit}&offset=${offset}&appendOnly=true`, {
    headers: {
      Authorization: `Bearer ${auth.user.token}`,
    },
  })

  if (!res.ok) throw new Error('Failed to load more solvers')

  const json = await res.json()
  return json.solvers || []
}