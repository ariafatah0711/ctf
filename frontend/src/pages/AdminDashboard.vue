<template>
  <div class="min-h-screen">
    <Navbar />
    <div class="h-16"></div>

    <h1 class="text-2xl font-bold text-blue-600 mb-6">👤 User Management</h1>

    <div v-if="loading" class="text-gray-500">Loading users...</div>

    <div v-else>
      <div v-if="members.length > 0" class="overflow-x-auto p-6">
        <!-- <MembersTable :members="members" /> -->
         <MembersTable 
            :members="members"
            @edit="handleEdit"
            @delete="handleDelete"
         />
      </div>
      <div v-else class="text-center text-gray-500 mt-10">Tidak ada data pengguna.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import config from '../config'
import Navbar from '../components/Navbar.vue'
import MembersTable from '../components/MembersTable.vue'

interface User {
  id: string
  username: string
}

const users = ref<User[]>([])
const loading = ref(true)
const auth = useAuthStore()
const router = useRouter()

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await fetch(`${config.BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    const data = await res.json()
    console.log(data)
    users.value = Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error)
  } finally {
    loading.value = false
  }
}

const goToProfile = (username: string) => {
  router.push(`/profile/${username}`)
}

// 🔁 Transform users -> members format
const members = computed(() =>
  users.value.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
    lastSignIn: user.lastSignIn,
    avatar: user.avatar,
  }))
)

onMounted(fetchUsers)

const handleEdit = (index: number) => {
  const user = members.value[index]
  console.log('Edit:', user)
  // Bisa buka modal, navigasi ke edit page, dll
}

const handleDelete = (index: number) => {
  const user = members.value[index] 
  if (confirm(`Hapus ${user.name}?`)) {
    members.value.splice(index, 1)
  }
}
</script>