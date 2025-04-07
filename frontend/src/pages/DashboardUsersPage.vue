<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
        👤 User Management
      </h1>
    </div>

    <div class="flex flex-row items-center justify-between gap-4">
      <Breadcrumbs class="w-full sm:w-auto flex-1" />
      <div v-if="!loading" class="flex gap-2">
        <IconButton @click="handleAddUser" :icon="UserPlusIcon" label="Add User" color="blue" />
        <IconButton @click="handleBatchAddUsers" :icon="UsersIcon" label="Batch Add" color="green" />
      </div>
    </div>

    <div v-if="loading" class="text-gray-500 dark:text-gray-400">Loading users...</div>
    <div v-else>
      <div v-if="members.length > 0" class="overflow-x-auto mt-4">
        <BaseTable
          :columns="[
            { label: 'Member', key: 'member', grow: true },
            { label: 'Role', key: 'role', width: 'w-25' },
            { label: 'Last Sign In', key: 'lastSignIn', width: 'w-45' }
          ]"
          :rows="users"
          @edit="handleEdit"
          @delete="handleDelete"
        >
          <template #member="{ row }">
            <div class="flex items-center gap-3">
              <img :src="row.avatar" class="w-8 h-8 rounded object-cover" :alt="row.name" />
              <div class="flex flex-col">
                <small class="font-medium dark:text-white">{{ row.name }}</small>
                <small class="text-slate-500 dark:text-slate-400">{{ row.email }}</small>
              </div>
            </div>
          </template>
        </BaseTable>

        <!-- Pagination -->
        <nav aria-label="User pagination" class="flex justify-center mt-6">
          <ul class="flex gap-2">
            <li>
              <button
                @click="prevPage"
                :disabled="page === 1"
                class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-sm dark:text-white"
              >
                Prev
              </button>
            </li>
            <li v-for="n in totalPages" :key="n">
              <button
                @click="setPage(n)"
                :class="[
                  'px-3 py-1.5 rounded text-sm font-medium',
                  page === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white'
                ]"
              >
                {{ n }}
              </button>
            </li>
            <li>
              <button
                @click="nextPage"
                :disabled="page === totalPages"
                class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-sm dark:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data pengguna.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import config from '../config'
import Navbar from '../components/Navbar.vue'
import IconButton from "../components/IconButton.vue"
import Breadcrumbs from "../components/Breadcrumbs.vue"
import BaseTable  from "../components/BaseTable.vue"
import { UserPlusIcon, UsersIcon } from '@heroicons/vue/24/solid'
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
    console.log(data)
    console.log('Total pages:', totalPages.value)
    console.log('Current page:', page.value)
    users.value = Array.isArray(data.data) ? data.data : []
    totalPages.value = data.totalPages || 1

    users.value = Array.isArray(data.data) ? data.data : []
    totalPages.value = data.totalPages || Math.ceil((data.total || users.value.length) / limit) || 1
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

watch(page, async (newPage) => {
  console.log('Page changed to', newPage)
  router.replace({ query: { ...route.query, page: newPage.toString() } })
  await fetchUsers()
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

    if (!res.ok) throw new Error(result.error || "Gagal update");

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

// add user
const submitUserPayload = async (payload: object) => {
  try {
    const res = await fetch(`${config.BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.message || 'Gagal tambah user')

    Swal.fire('Berhasil!', 'User berhasil ditambahkan.', 'success')
    await fetchUsers()
  } catch (err: any) {
    Swal.fire('Error', `Gagal tambah user: ${err.message}`, 'error')
  }
}
const handleAddUser = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Tambah User Baru',
    html: `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap" />
      <input id="swal-email" type="email" class="swal2-input" placeholder="Email" />
      <input id="swal-password" type="password" class="swal2-input" placeholder="Password (min. 6 karakter)" />
      <select id="swal-role" class="swal2-select">
        <option value="user">👤 User</option>
        <option value="maker">🛠️ Maker</option>
        <option value="admin">👑 Admin</option>
      </select>
    </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const name = (document.getElementById('swal-name') as HTMLInputElement)?.value.trim()
      const email = (document.getElementById('swal-email') as HTMLInputElement)?.value.trim()
      const password = (document.getElementById('swal-password') as HTMLInputElement)?.value
      const role = (document.getElementById('swal-role') as HTMLSelectElement)?.value

      if (!name || !email || !password || password.length < 6 || !role) {
        Swal.showValidationMessage('Semua field wajib diisi dan password minimal 6 karakter')
        return
      }

      return { name, email, password, role }
    }
  })

  if (formValues) {
    await submitUserPayload(formValues)
  }
}

const handleBatchAddUsers = async () => {
  const { value: csv } = await Swal.fire({
    title: 'Batch Tambah User',
    input: 'textarea',
    inputLabel: 'Masukkan daftar user (CSV: name,email,password,role)',
    inputPlaceholder: 'Contoh:\nJohn Doe,john@example.com,secret123,user\nJane Smith,jane@example.com,secret456,maker',
    inputAttributes: {
      rows: '8',
    },
    showCancelButton: true,
    preConfirm: (value) => {
      // const lines = value.split('\n').map(l => l.trim()).filter(Boolean)
      const lines: string[] = value.split('\n').map((l: string) => l.trim()).filter(Boolean);
      const data: any[] = []

      for (const line of lines) {
        const [name, email, password, role] = line.split(',').map(v => v.trim())
        if (!name || !email || !password || !role) {
          Swal.showValidationMessage(`Baris tidak valid: "${line}"`)
          return
        }
        data.push({ name, email, password, role })
      }

      return data
    }
  })

  if (csv && Array.isArray(csv)) {
    await submitUserPayload({ users: csv })
  }
}
</script>