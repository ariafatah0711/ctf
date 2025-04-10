<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
        🛠️ Manage Challenges Public
      </h1>
    </div>

    <div class="flex flex-wrap justify-center items-center gap-4">
      <Breadcrumbs class="w-full sm:w-auto flex-1" :extra-items="[{ name: 'Challenges', href: '/dashboard/challenges' }]" :extra-position="1" />
      <div v-if="!loading" class="flex gap-2">
        <IconButton @click="deleteSelected" :disabled="selectedIds.length === 0" :icon="TrashIcon" label="Delete" color="red" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>

    <!-- Table -->
    <div v-else>
      <div v-if="challenges.length > 0" class="overflow-x-auto mt-4">
        <PublicChallengeTable
          :rows="challenges"
          :selected="selectedIds"
          @view="viewDetails"
          @delete="deleteSingle"
          @toggleReview="toggleReview"
          @toggleApprove="toggleApprove"
          @update:selected="val => selectedIds = val"
        />
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
          Tidak ada data tantangan.
      </div>
    </div>

    <!-- Modal Detail -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg max-w-lg w-full shadow-lg relative">
          <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white">&times;</button>
          <h2 class="text-xl font-bold mb-4">Detail Challenge</h2>
          <p><strong>Judul:</strong> {{ selectedChallenge?.title }}</p>
          <p><strong>Deskripsi:</strong> {{ selectedChallenge?.description }}</p>
          <p><strong>Hint:</strong> {{ selectedChallenge?.hint }}</p>
          <p><strong>Kesulitan:</strong> {{ selectedChallenge?.difficulty }}</p>
          <p><strong>URL:</strong> <a class="text-blue-600 underline" :href="selectedChallenge?.url" target="_blank">{{ selectedChallenge?.url }}</a></p>
          <p><strong>Tag:</strong> {{ selectedChallenge?.tags.join(', ') }}</p>
          <p><strong>Dikirim Oleh:</strong> {{ selectedChallenge?.username }}</p>
          <p><strong>Submitted At:</strong> {{ new Date(selectedChallenge?.submitted_at).toLocaleString() }}</p>
        </div>
      </div>
    </Teleport>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        @update:page="setPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import config from '../../config'
import Swal from 'sweetalert2'
import Pagination from "../../components/Pagination.vue"
import PublicChallengeTable from "../../components/dashboard/PublicChallengeTable.vue"
import Breadcrumbs from "../../components/Breadcrumbs.vue"
import IconButton from "../../components/IconButton.vue"
import { TrashIcon } from "@heroicons/vue/24/solid";

const auth = useAuthStore()

const challenges = ref<any[]>([])
const selectedIds = ref<number[]>([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const limit = 3

const isAllSelected = computed(() => {
  return challenges.value.length > 0 &&
    challenges.value.every(c => selectedIds.value.includes(c.id))
})

const showModal = ref(false)
const selectedChallenge = ref<any | null>(null)

const setPage = (newPage: number) => {
  page.value = newPage
}

const viewDetails = (challenge: any) => {
  selectedChallenge.value = challenge
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedChallenge.value = null
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = challenges.value.map(c => c.id)
  }
}

const fetchChallenges = async () => {
  loading.value = true
  try {
    const res = await fetch(
      `${config.BASE_URL}/api/challenges/public_admin?page=${page.value}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
      }
    )
    const data = await res.json()
    challenges.value = data.data
    totalPages.value = data.totalPages || 1
    console.log(data)
  } catch (err) {
    console.error('Gagal fetch data:', err)
  } finally {
    loading.value = false
  }
}

// TINJAU / BATALKAN
const toggleReview = async (id: number) => {
  const challenge = challenges.value.find(c => c.id === id)
  if (!challenge) return

  const confirm = await Swal.fire({
    title: challenge.reviewed ? 'Batalkan Tinjauan?' : 'Tinjau Challenge?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
  })

  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public_admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify({
        reviewed: !challenge.reviewed,
      }),
    })

    if (!res.ok) throw new Error('Gagal update tinjauan')

    await fetchChallenges()
    Swal.fire('Berhasil', 'Status tinjauan diperbarui.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal', 'Tidak dapat memperbarui tinjauan.', 'error')
  }
}

// SETUJUI / BATALKAN
const toggleApprove = async (id: number) => {
  const challenge = challenges.value.find(c => c.id === id)
  if (!challenge) return

  const confirm = await Swal.fire({
    title: challenge.accepted ? 'Batalkan Persetujuan?' : 'Setujui Challenge?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
  })

  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public_admin/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify({
        accepted: !challenge.accepted,
      }),
    })

    if (!res.ok) throw new Error('Gagal update persetujuan')

    await fetchChallenges()
    Swal.fire('Berhasil', 'Status persetujuan diperbarui.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal', 'Tidak dapat memperbarui persetujuan.', 'error')
  }
}

// HAPUS TUNGGAL
const deleteSingle = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Hapus Challenge ini?',
    text: 'Aksi ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
  })

  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/public_admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    })

    if (!res.ok) throw new Error('Gagal menghapus challenge')

    await fetchChallenges()
    Swal.fire('Dihapus', 'Challenge berhasil dihapus.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal', 'Gagal menghapus challenge.', 'error')
  }
}

// HAPUS TERPILIH
const deleteSelected = async () => {
  if (selectedIds.value.length === 0) return

  const confirm = await Swal.fire({
    title: 'Hapus Beberapa Challenge?',
    text: `Total: ${selectedIds.value.length}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
  })

  if (!confirm.isConfirmed) return

  try {
    for (const id of selectedIds.value) {
      const res = await fetch(`${config.BASE_URL}/api/challenges/public_admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })

      if (!res.ok) {
        console.warn(`Gagal hapus challenge id ${id}`)
        // Optional: kamu bisa tampilkan error tapi tetap lanjut ke yang lain
      }
    }

    selectedIds.value = []
    await fetchChallenges()
    Swal.fire('Berhasil', 'Challenge terpilih berhasil dihapus.', 'success')
  } catch (err) {
    console.error(err)
    Swal.fire('Gagal', 'Tidak dapat menghapus data.', 'error')
  }
}

watch(page, fetchChallenges)
onMounted(fetchChallenges)
</script>