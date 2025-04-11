// services/useChallengeList.ts
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '../stores/auth'
import config from '../config/env'

const CACHE_TTL = config.CACHE_TTL
const PREFIX = 'challenges_cache'

const getCacheKey = (page: number, difficulty: string, tag: string) => {
  const key = `${PREFIX}_page${page}_${difficulty || 'all'}_${tag || 'all'}`
  return key
}

function loadCache(key: string) {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_TTL) {
      return parsed.data
    }
  } catch (e) {
    console.warn('Gagal parse cache:', e)
  }
  return null
}

function saveCache(key: string, data: any) {
  const timestamp = Date.now()
  localStorage.setItem(key, JSON.stringify({ timestamp, data }))
}

export async function useChallengeList(page: number, difficulty: string, tag: string) {
  const auth = useAuthStore()

  const loading = ref(false)
  const challenges = ref<any[]>([])
  const totalPages = ref(1)
  const availableTags = ref<string[]>([])

  const cacheKey = getCacheKey(page, difficulty, tag)

  const fetchFreshData = async () => {
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      if (difficulty) params.set('difficulty', difficulty)
      if (tag) params.set('tags', tag)

      const res = await fetch(`${config.BASE_URL}/api/challenges?${params}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })

      const json = await res.json()

      console.log("🔥 Fresh fetched data:", json.data)

      if (!res.ok) throw new Error(json.message || 'Gagal fetch challenge')

      challenges.value = [] // force reactive update
      challenges.value = [...json.data]
      totalPages.value = json.totalPages
      availableTags.value = json.tags || []

      saveCache(cacheKey, {
        data: json.data,
        totalPages: json.totalPages,
        tags: json.tags || [],
      })
    } catch (err) {
      console.error(err)
    }
  }

  const fetchData = async () => {
    loading.value = true
    try {
      const cached = loadCache(cacheKey)
      if (cached) {
        console.log("📦 Old cached data:", cached.data)
        challenges.value = [...cached.data]
        totalPages.value = cached.totalPages
        availableTags.value = cached.tags

        // tetap fetch baru untuk update
        fetchFreshData()
        return
      }

      await fetchFreshData()
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  await fetchData()

  return {
    loading,
    challenges,
    totalPages,
    availableTags,
    refetch: fetchData,
  }
}
