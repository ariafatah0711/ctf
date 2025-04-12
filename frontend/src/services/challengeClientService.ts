import config from '@/config/env'
import { swalError, swalSuccess } from '@/utils/swalAlert'
import { useAuthStore } from '@/stores/auth'

export const fetchPublicChallenges = async () => {
  const auth = useAuthStore()
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const data = await res.json()
    return data.data || []
  } catch (err: any) {
    swalError("Gagal memuat challenge", err.message)
    throw err
  }
}

export const addChallenge = async (payload: any) => {
  const auth = useAuthStore()
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error)
    swalSuccess('Challenge berhasil ditambahkan!')
  } catch (err: any) {
    swalError('Gagal menambahkan challenge', err.message)
    throw err
  }
}

export const updateChallenge = async (id: string, payload: any) => {
  const auth = useAuthStore()
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error)
    swalSuccess('Challenge berhasil diperbarui!')
  } catch (err: any) {
    swalError('Gagal memperbarui challenge', err.message)
    throw err
  }
}

export const deleteChallenge = async (id: string) => {
  const auth = useAuthStore()
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error)
    swalSuccess('Challenge berhasil dihapus!')
  } catch (err: any) {
    swalError('Gagal menghapus challenge', err.message)
    throw err
  }
}