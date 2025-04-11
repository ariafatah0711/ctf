import { ref, watch } from 'vue'
import config from '../config/env'

const CACHE_TTL = config.CACHE_TTL
const getCacheKey = (page: number) => `leaderboard_cache_page_${page}`

const loadCache = (page: number) => {
  const raw = localStorage.getItem(getCacheKey(page))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data
    }
  } catch (e) {
    console.warn('Leaderboard cache error:', e)
  }
  return null
}

const saveCache = (page: number, data: any) => {
  localStorage.setItem(getCacheKey(page), JSON.stringify({
    timestamp: Date.now(),
    data,
  }))
}

export const useLeaderboard = (initialPage = 1, limit = 25) => {
  const leaderboard = ref([])
  const page = ref(initialPage)
  const totalPages = ref(1)
  const loading = ref(false)

  const fetchLeaderboard = async () => {
    const cache = loadCache(page.value)
    if (cache) {
      leaderboard.value = cache.leaderboard || []
      totalPages.value = cache.totalPages || 1
      // 🔁 Tetap fetch ulang di background
    }

    loading.value = true
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/leaderboard?page=${page.value}&limit=${limit}`)
      const raw = await res.json()
      leaderboard.value = Array.isArray(raw.leaderboard) ? raw.leaderboard : []
      totalPages.value = raw.totalPages || 1
      saveCache(page.value, raw)
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    } finally {
      loading.value = false
    }
  }

  watch(page, fetchLeaderboard, { immediate: true })

  return {
    leaderboard,
    page,
    totalPages,
    loading,
    setPage: (n: number) => { if (n !== page.value) page.value = n },
    refetch: fetchLeaderboard,
  }
}