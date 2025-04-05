<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">👤 User Management</h1>

    <div v-if="loading" class="text-gray-500">Loading users...</div>

    <div v-else>
      <div v-if="members.length > 0" class="overflow-x-auto">
        <MembersTable
          :members="members"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <!-- Pagination -->
        <nav aria-label="User pagination" class="flex justify-center mt-6">
          <ul class="flex gap-2">
            <li>
              <button
                @click="prevPage"
                :disabled="page === 1"
                class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
            </li>
            <li v-for="n in totalPages" :key="n">
              <button
                @click="setPage(n)"
                :class="[
                  'px-3 py-1.5 rounded',
                  page === n
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                ]"
              >
                {{ n }}
              </button>
            </li>
            <li>
              <button
                @click="nextPage"
                :disabled="page === totalPages"
                class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div v-else class="text-center text-gray-500 mt-10">Tidak ada data pengguna.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import config from '../config'
import Navbar from '../components/Navbar.vue'
import MembersTable from '../components/MembersTable.vue'
import GlobalSwal from '../utills/GlobalSwal'

const Swal = GlobalSwal
const users = ref<any[]>([])
const loading = ref(true)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const page = ref(1)
const limit = 25
const totalPages = ref(1)

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await fetch(`${config.BASE_URL}/api/users?page=${page.value}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    const data = await res.json()
    users.value = Array.isArray(data.data) ? data.data : []
    totalPages.value = data.totalPages || 1
  } catch (error) {
    console.error('Gagal mengambil data pengguna:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const queryPage = parseInt(route.query.page as string)
  if (!isNaN(queryPage) && queryPage > 0) {
    page.value = queryPage
  }
  fetchUsers()
})

watch(page, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage.toString() } })
  fetchUsers()
})

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

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const setPage = (n: number) => {
  if (n !== page.value) {
    page.value = n
  }
}

// EDIT USER
const handleEdit = async (index: number) => {
  const user = members.value[index];

  const { value: formValues } = await Swal.fire({
    title: 'Edit User',
    html: `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap" value="${user.name}" />

      <input id="swal-email" type="email" class="swal2-input" placeholder="Email" value="${user.email}" />

      <input id="swal-password" type="password" class="swal2-input" placeholder="Password (biarkan kosong jika tidak diubah)" />

      <select id="swal-role" class="swal2-select">
        <option value="user" ${user.role === 'user' ? 'selected' : ''}>👤 User</option>
        <option value="maker" ${user.role === 'maker' ? 'selected' : ''}>🛠️ Maker</option>
        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>👑 Admin</option>
      </select>
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = (document.getElementById('swal-name') as HTMLInputElement)?.value.trim();
      const email = (document.getElementById('swal-email') as HTMLInputElement)?.value.trim();
      const password = (document.getElementById('swal-password') as HTMLInputElement)?.value;
      const role = (document.getElementById('swal-role') as HTMLSelectElement)?.value;

      if (!name || !role || !email) {
        Swal.showValidationMessage('Nama, email, dan role tidak boleh kosong');
        return;
      }

      return { name, email, role, password };
    }
  });

  if (!formValues) return;

  try {
    // Hapus password jika kosong agar tidak dikirim ke backend
    const payload: any = {
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
    };

    if (formValues.password && formValues.password.length >= 6) {
      payload.password = formValues.password;
    }

    const res = await fetch(`${config.BASE_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Gagal update");

    Swal.fire('Berhasil!', 'User berhasil diperbarui.', 'success');
    await fetchUsers();
  } catch (err: any) {
    Swal.fire('Error', `Gagal update user: ${err.message}`, 'error');
  }
};

// DELETE USER
const handleDelete = async (index: number) => {
  const user = members.value[index]

  const confirm = await Swal.fire({
    title: 'Yakin?',
    text: `Hapus user ${user.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })

  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/users/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    const result = await res.json()

    if (!res.ok) throw new Error(result.message || "Gagal hapus")

    Swal.fire('Dihapus!', 'User berhasil dihapus.', 'success')
    await fetchUsers()
  } catch (err: any) {
    Swal.fire('Error', `Gagal hapus user: ${err.message}`, 'error')
  }
}
</script>