import { ref, computed, watchEffect } from 'vue'
import useSWRV from 'swrv'
import config from '../config/env'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'

const CACHE_KEY_PREFIX = 'challenge_history_cache'
const CACHE_TTL = config.CACHE_TTL || 1000 * 60 * 5 // default 5 menit

const getCacheKey = (userId: string | undefined) =>
  `${CACHE_KEY_PREFIX}_${userId || 'me'}`

const loadCachedData = (key: string) => {
  const raw = localStorage.getItem(key)
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

const saveToCache = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify({
    timestamp: Date.now(),
    data,
  }))
}

export const useChallengeHistory = () => {
  const route = useRoute()
  const auth = useAuthStore()
  const userId = computed(() => route.query.id as string | undefined)
  const page = ref(1)
  const limit = 15

  const cacheKey = computed(() => getCacheKey(userId.value))
  const localCache = ref(loadCachedData(cacheKey.value))
  const allData = ref<any[]>([])

  const currentKey = computed(() => {
    const base = `${config.BASE_URL}/api/challenges/history`
    const query = `?page=${page.value}&limit=${limit}`
    const user = userId.value ? `&userId=${userId.value}` : ''
    return `${base}${query}${user}`
  })

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`
      }
    })
    const json = await res.json()
    saveToCache(cacheKey.value, json)
    return json
  }

  const { data: swrvData, isValidating } = useSWRV(currentKey, fetcher, {
    ttl: CACHE_TTL,
    dedupingInterval: 2000,
  })

  // Gabungkan data baru saat data berubah
  watchEffect(() => {
    const newItems = swrvData.value?.data
    if (newItems && newItems.length) {
      const unique = newItems.filter(
        (item: any) =>
          !allData.value.some(
            (existing: any) =>
              existing.challenge_id === item.challenge_id &&
              existing.completed_at === item.completed_at
          )
      )
      allData.value.push(...unique)
    }
  })

  const data = computed(() =>
    allData.value.length ? allData.value : localCache.value?.data || []
  )

  const hasMore = computed(() => (swrvData.value?.data?.length ?? 0) === limit)
  const error = computed(() => swrvData.value?.error || null)

  const loadNextPage = () => {
    page.value++
  }

  return {
    data,
    hasMore,
    error,
    page,
    loadNextPage,
    isLoading: isValidating,
  }
}
