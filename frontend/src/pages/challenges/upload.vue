<template>
    <div class="p-4 max-w-screen-xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
          🎯 Upload
        </h1>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-center items-center gap-4 mb-4">
        <Breadcrumbs class="w-full sm:w-auto flex-1" />
        <IconButton @click="openForm('add')" :icon="PlusIcon" label="Add" color="blue" />
        <IconButton @click="handleBulkDelete" :icon="TrashIcon" label="Delete" color="red" />
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center py-6">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
  
      <!-- Challenge Table -->
      <div v-else>
        <div v-if="challenges.length > 0" class="overflow-x-auto mt-4">
          <PublicChallengeTable
            :rows="challenges"
            :loading="loading"
            :selected="selected"
            @update:selected="selected = $event"
            @edit="openForm('edit', $event)"
            @delete="confirmDelete($event)"
          />
        </div>
        <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
          Belum Ada Challenges Yang Di upload
        </div>
      </div>
  
      <!-- Modal Challenge Form -->
      <Teleport to="body">
        <div
          v-if="showForm"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <PublicChallengeForm  
            :form-type="formType"
            :initialData="formData"
            @cancel="showForm = false"
            @submit="handleSubmit"
          />
          <button
            @click="showForm = false"
            class="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition duration-200 z-50"
            aria-label="Tutup form"
          >
            ❌
          </button>
        </div>
      </Teleport>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { swal } from '@/utils/swalUtils'  // Import swal from the utils file
import PublicChallengeTable from '@/components/table/PublicChallengeTable.vue'
import PublicChallengeForm from '@/components/table/PublicChallengeForm.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import IconButton from '@/components/IconButton.vue'
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/solid";
import config from '@/config/env'
import {
  fetchPublicChallenges,
  addChallenge,
  updateChallenge,
  deleteChallenge
} from '@/services/challengeClientService'

const auth = useAuthStore()
const challenges = ref([])
const loading = ref(true)
const selected = ref<string[]>([])
const showForm = ref(false)
const formType = ref('add')
const formData = ref({})

const loadChallenges = async () => {
  loading.value = true
  challenges.value = await fetchPublicChallenges()
  loading.value = false
}

onMounted(loadChallenges)

const openForm = (type: any, data: any = {}) => {
  formType.value = type
  formData.value = {
    ...data,
    tagsInput: Array.isArray(data.tags) ? data.tags.join(', ') : ''
  }
  showForm.value = true
}

const handleSubmit = async (formValues: any) => {
  const payload = {
    title: formValues.title?.trim(),
    description: formValues.description?.trim(),
    url: formValues.url?.trim(),
    difficulty: Number(formValues.difficulty),
    tags: formValues.tags,
    hint: formValues.hint?.trim() || null,
    flag: formValues.flag?.trim(),
  }

  if (!payload.title || !payload.description || !payload.url || !payload.difficulty || payload.tags.length === 0) {
    return swal.error('Semua field wajib diisi.')
  }

  if (!config.FLAG_REGEX.test(payload.flag)) {
    return swal.error(`Flag harus sesuai format: ${config.FLAG_FORMAT}`)
  }

  try {
    if (formType.value === 'add') {
      await addChallenge(payload)
    } else {
      await updateChallenge(formData.value.id, payload)
    }
    showForm.value = false
    await loadChallenges()
  } catch {}
}

const confirmDelete = async (id: string) => {
  const confirm = await swal.confirm('Hapus challenge ini?', 'Tindakan ini tidak dapat dibatalkan.', 'Ya, hapus')

  if (!confirm.isConfirmed) return
  try {
    await deleteChallenge(id)
    await loadChallenges()
  } catch {}
}

const handleBulkDelete = async () => {
  if (selected.value.length === 0) {
    return swal.error('Pilih setidaknya satu challenge untuk dihapus.')
  }

  const confirm = await swal.confirm(`Hapus ${selected.value.length} challenge?`, 'Tindakan ini tidak dapat dibatalkan.', 'Ya, hapus')

  if (!confirm.isConfirmed) return

  loading.value = true
  try {
    await Promise.all(selected.value.map(deleteChallenge))
    swal.success('Semua challenge berhasil dihapus!')
    selected.value = []
    await loadChallenges()
  } catch {
    swal.error('Gagal menghapus beberapa challenge')
  } finally {
    loading.value = false
  }
}
</script>

<!-- <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '../../stores/auth'
  import config from '../../config/env'
  import { swalSuccess, swalError } from '../../utils/swalAlert'
  import GlobalSwal from '../../utils/GlobalSwal'
  import PublicChallengeTable from '../../components/table/PublicChallengeTable.vue'
  import PublicChallengeForm from '../../components/table/PublicChallengeForm.vue'
  import Breadcrumbs from '../../components/Breadcrumbs.vue'
  import IconButton from '../../components/IconButton.vue'
  import { PlusIcon, TrashIcon } from "@heroicons/vue/24/solid";
  
  const auth = useAuthStore()
  const challenges = ref([])
  const loading = ref(true)
  const selected = ref<string[]>([]) 
  const showForm = ref(false)
  const formType = ref('add')
  const formData = ref({})

  const openForm = (type: any, data: any = {}) => {
    formType.value = type
    formData.value = {
      ...data,
      tagsInput: Array.isArray(data.tags) ? data.tags.join(', ') : ''
    }
    showForm.value = true
  }
  
  const fetchMyPublicChallenges = async () => {
    loading.value = true
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/public`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const data = await res.json()
      challenges.value = data.data || []
    } catch (err: any) {
      swalError("Gagal memuat challenge", err)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchMyPublicChallenges)
  
  const handleSubmit = async (formValues: any) => {
    const payload = {
      title: formValues.title?.trim(),
      description: formValues.description?.trim(),
      url: formValues.url?.trim(),
      difficulty: Number(formValues.difficulty),
      tags: formValues.tags,
      hint: formValues.hint?.trim() || null,
      flag: formValues.flag?.trim(),
    }
  
    if (!payload.title || !payload.description || !payload.url || !payload.difficulty || payload.tags.length === 0) {
      swalError('Semua field wajib diisi.')
      return
    }

    if (!config.FLAG_REGEX.test(payload.flag)) {
      swalError(`Flag harus sesuai format: ${config.FLAG_FORMAT}`)
      return
    }
  
    if (formType.value === 'add') {
      await handleAdd(payload)
    } else {
      await handleEdit(payload)
    }
  }
  
  const handleAdd = async (payload: any) => {
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
      showForm.value = false
      fetchMyPublicChallenges()
    } catch (err: any) {
      swalError('Gagal menambahkan challenge', err)
    }
  }
  
  const handleEdit = async (payload: any) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/public/${formData.value.id}`, {
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
      showForm.value = false
      fetchMyPublicChallenges()
    } catch (err: any) {
      swalError('Gagal memperbarui challenge', err)
    }
  }
  
  const confirmDelete = async (id: any) => {
    const confirm = await GlobalSwal.fire({
      title: 'Hapus challenge ini?',
      text: 'Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
    })
  
    if (!confirm.isConfirmed) return
  
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
      fetchMyPublicChallenges()
    } catch (err: any) {
      swalError('Gagal menghapus challenge', err)
    }
  }

  const handleBulkDelete = async () => {
    if (selected.value.length === 0) {
      swalError('Pilih setidaknya satu challenge untuk dihapus.')
      return
    }

    const confirm = await GlobalSwal.fire({
      title: `Hapus ${selected.value.length} challenge?`,
      text: 'Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
    })

    if (!confirm.isConfirmed) return

    loading.value = true
    try {
      await Promise.all(
        selected.value.map(async (id) => {
          const res = await fetch(`${config.BASE_URL}/api/challenges/public/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${auth.user.token}`,
            },
          })
          const result = await res.json()
          if (!res.ok) throw new Error(result.error)
        })
      )

      swalSuccess('Semua challenge berhasil dihapus!')
      selected.value = []
      fetchMyPublicChallenges()
    } catch (err: any) {
      swalError('Gagal menghapus beberapa challenge', err)
    } finally {
      loading.value = false
    }
  }
</script> -->