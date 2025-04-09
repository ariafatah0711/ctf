<template>
    <div class="p-4 max-w-screen-xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
          🎯 Upload Challenge Buatanmu
        </h1>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-center items-center gap-4 mb-4">
        <Breadcrumbs class="w-full sm:w-auto flex-1" />
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
          @click="openForm('add')"
        >
          ➕ Tambah Challenge
        </button>
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
            @edit="openForm('edit', $event)"
            @delete="confirmDelete($event)"
          />
        </div>
        <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
          Tidak ada data tantangan.
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
            :initial-data="formData"
            @submit="handleSubmit"
            @cancel="showForm = false"
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
  import { ref, onMounted , onUnmounted} from 'vue'
  import { useAuthStore } from '../../stores/auth'
  import config from '../../config'
  import { swalSuccess, swalError } from '../../utills/swalAlert'
  import GlobalSwal from '../../utills/GlobalSwal'
  import PublicChallengeTable from '../../components/table/PublicChallengeTable.vue'
  import PublicChallengeForm from '../../components/table/PublicChallengeForm.vue'
  import Breadcrumbs from '../../components/Breadcrumbs.vue'
  
  const auth = useAuthStore()
  const challenges = ref([])
  const loading = ref(true)
  const showForm = ref(false)
  const formType = ref('add')
  const formData = ref({})
  
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
    } catch (error) {
      swalError("Gagal memuat challenge", error.message)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchMyPublicChallenges)
  
  const openForm = (type, data = {}) => {
    formType.value = type
    formData.value = {
      ...data,
      tagsInput: Array.isArray(data.tags) ? data.tags.join(', ') : ''
    }
    showForm.value = true
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      showForm.value = false;
    }
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }
  onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
  onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})
  
  const handleSubmit = async (formValues) => {
    const payload = {
      title: formValues.title?.trim(),
      description: formValues.description?.trim(),
      url: formValues.url?.trim(),
      difficulty: Number(formValues.difficulty),
      tags: formValues.tagsInput?.split(',').map(tag => tag.trim()).filter(Boolean),
      hint: formValues.hint?.trim() || null,
    }
  
    if (!payload.title || !payload.description || !payload.url || !payload.difficulty || !payload.tags?.length) {
      swalError('Semua field wajib diisi.')
      return
    }
  
    if (formType.value === 'add') {
      await handleAdd(payload)
    } else {
      await handleEdit(payload)
    }
  }
  
  const handleAdd = async (payload) => {
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
    } catch (err) {
      swalError('Gagal menambahkan challenge', err)
    }
  }
  
  const handleEdit = async (payload) => {
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
      if (!res.ok) throw new Error(result.message)
  
      swalSuccess('Challenge berhasil diperbarui!')
      showForm.value = false
      fetchMyPublicChallenges()
    } catch (err) {
      swalError('Gagal memperbarui challenge', err.message)
    }
  }
  
  const confirmDelete = async (id) => {
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
      if (!res.ok) throw new Error(result.message)
  
      swalSuccess('Challenge berhasil dihapus!')
      fetchMyPublicChallenges()
    } catch (err) {
      swalError('Gagal menghapus challenge', err.message)
    }
  }
</script>