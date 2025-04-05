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
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    lastSignIn: user.lastSignIn,
    avatar: user.avatar,
  }))
)

onMounted(fetchUsers)

const handleEdit = async (index: number) => {
  const user = members.value[index]

  const newName = prompt("Nama baru:", user.name)
  const newRole = prompt("Role baru:", user.role)

  if (!newName || !newRole) return alert("Edit dibatalkan.")

  try {
    const res = await fetch(`${config.BASE_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: newName,
        role: newRole,
      }),
    })

    const result = await res.json()

    if (!res.ok) throw new Error(result.message || "Gagal update")

    // Update lokal
    members.value[index].name = newName
    members.value[index].role = newRole
    alert("User berhasil diperbarui.")
  } catch (err) {
    alert(`Gagal update user: ${err}`)
  }
}

const handleDelete = async (index: number) => {
  const user = members.value[index]
  if (!confirm(`Hapus ${user.id}?`)) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/users/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    const result = await res.json()

    if (!res.ok) throw new Error(result.message || "Gagal hapus")

    members.value.splice(index, 1)
    alert("User berhasil dihapus.")
  } catch (err) {
    alert(`Gagal hapus user: ${err}`)
  }
}
</script>