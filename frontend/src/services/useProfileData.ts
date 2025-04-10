// services/useProfileData.ts
import { reactive, computed, watch } from 'vue'
import useSWRV from 'swrv'
import { useAuthStore } from '../stores/auth'
import config from '../config'

const CACHE_TTL = 5 * 60 * 1000 // 5 menit
const PREFIX = 'profile_cache_' // prefix untuk localStorage

const data_profile = reactive<Record<string, any>>({})

export function useProfileData(username: string) {
  const auth = useAuthStore()
  const cacheKey = `${PREFIX}${username}`

  const loadCache = () => {
    const raw = localStorage.getItem(cacheKey)
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

  const saveCache = (data: any) => {
    const timestamp = Date.now()
    const item = {
      timestamp,
      data,
    }
  
    // Simpan cache baru
    localStorage.setItem(cacheKey, JSON.stringify(item))

    // Cek dan bersihkan jika melebihi batas
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
      .sort((a, b) => a.timestamp - b.timestamp) // urut dari paling lama
  
    const maxCache = 10
    if (keys.length > maxCache) {
      const toDelete = keys.slice(0, keys.length - maxCache)
      toDelete.forEach(item => localStorage.removeItem(item.key))
    }
  }  

  const { data, error, isValidating, mutate } = useSWRV(
    () => `${config.BASE_URL}/api/users?username=${username}`,
    async (url: string) => {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Gagal ambil profil')
      saveCache(result.data)
      return result.data
    },
    {
      dedupingInterval: 2000,
      ttl: CACHE_TTL,
      initialData: loadCache(),
    }
  )

  // Sinkronkan ke object global
  watch(data, (newData) => {
    if (newData) {
      data_profile[username] = newData
    }
  }, { immediate: true })

  return {
    user: computed(() => data_profile[username]),
    isValidating,
    error,
    mutate, // buat re-fetch manual
  }
}
