<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
        👤 User Management
      </h1>
    </div>

    <div class="flex flex-wrap justify-center items-center gap-4">
      <Breadcrumbs class="w-full sm:w-auto flex-1" />
      <div v-if="!loading" class="flex gap-2">
        <IconButton @click="showAddUserModal" :icon="UserPlusIcon" label="Add" color="blue" />
        <IconButton @click="handleBatchAddUsers" :icon="UserGroupIcon" label="Batch" color="green" />
        <IconButton @click="handleBatchDelete" :icon="UserMinusIcon" label="Delete" color="red" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div v-if="members.length > 0" class="overflow-x-auto mt-4">
        <BaseTable
          v-model:selected="selected"
          :columns="[
            { label: 'Member', key: 'member', grow: true },
            { label: 'Role', key: 'role', width: 'w-25' },
            { label: 'Last Sign In', key: 'lastSignIn', width: 'w-45' }
          ]"
          :rows="users"
          @edit="showEditUserModal"
          @delete="handleDelete"
          :selected="selectedUsers"
          @update:selected="(val) => selectedUsers = val"
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

        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @update:page="setPage"
        />
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data pengguna.
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <!-- <div v-if="showForm"> -->
      <UserForm
          :type="formType"
          :initialData="formData"
          @submit="(data) => {
            if (formType === 'add') {
              handleAddUser(data)
            } else {
              handleEditUser(data)
            }
            showForm.value = false
          }"
        />
      <button
        @click="showForm = false"
        class="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition duration-200 z-50"
        aria-label="Tutup form">❌</button>
    </div>
  </Teleport>
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
import { UserPlusIcon, UserGroupIcon, UserMinusIcon } from "@heroicons/vue/24/solid";
import GlobalSwal from '../utills/GlobalSwal'
import Pagination from '../components/Pagination.vue'
import UserForm from "../components/dashboard/UserForm.vue"

const Swal = GlobalSwal
const users = ref<any[]>([])
const loading = ref(true)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const page = ref(1)
const limit = 25
const totalPages = ref(1)
const selected = ref<number[]>([])

const showForm = ref(false)
const formType = ref('add')
const formData = ref({});

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await fetch(`${config.BASE_URL}/api/users?page=${page.value}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
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

const openForm = (type = 'add', data = {}) => {
  formType.value = type;
  formData.value = data;  // Pastikan data terisi
  showForm.value = true;
  console.log("Form Data:", formData.value);  // Tambahkan log untuk cek data
};

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

const showAddUserModal = () => openForm('add');
const handleAddUser = async (userData: any) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(userData),
      })
      const result = await res.json()
      if (res.ok) {
        await Swal.fire('Berhasil', 'User berhasil ditambahkan!', 'success')
        await fetchUsers()
        showForm.value = false
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan', 'error')
    }
}

const showEditUserModal = async (index: number) => {
  const user = members.value[index]; // Ambil data pengguna berdasarkan index

  // Buka form untuk edit
  formType.value = 'edit';
  formData.value = { ...user }; // Set data untuk edit ke state userData
  showForm.value = true; // Tampilkan form
};

const handleEditUser = async (updatedData: any) => {
  try {
    // Kirim data yang diperbarui ke API
    const res = await fetch(`${config.BASE_URL}/api/users/${updatedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || 'Gagal update');

    // Jika berhasil, tampilkan notifikasi
    await Swal.fire('Berhasil', 'User berhasil diperbarui!', 'success');
    await fetchUsers(); // Ambil ulang data pengguna setelah update
    showForm.value = false; // Sembunyikan form setelah berhasil
  } catch (err: any) {
    Swal.fire('Gagal', err.message || 'Terjadi kesalahan', 'error');
  }
};

// DELETE USER
const handleDelete = async (index: number) => {
  const user = members.value[index]

  const confirm = await Swal.fire({
    title: 'Yakin?', text: `Hapus user ${user.name}?`, icon: 'warning',
    showCancelButton: true, confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'})
  if (!confirm.isConfirmed) return

  try {
    const res = await fetch(`${config.BASE_URL}/api/users/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
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
        Authorization: `Bearer ${auth.user.token}`,
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

// const handleAddUser = async () => {
//   const { value: formValues } = await Swal.fire({
//     title: 'Tambah User Baru',
//     html: `
//     <div style="display: flex; flex-direction: column; gap: 10px;">
//       <input id="swal-name" class="swal2-input" placeholder="Nama Lengkap" />
//       <input id="swal-email" type="email" class="swal2-input" placeholder="Email" />
//       <input id="swal-password" type="password" class="swal2-input" placeholder="Password (min. 6 karakter)" />
//       <select id="swal-role" class="swal2-select">
//         <option value="user">👤 User</option>
//         <option value="maker">🛠️ Maker</option>
//         <option value="admin">👑 Admin</option>
//       </select>
//     </div>
//     `,
//     focusConfirm: false,
//     showCancelButton: true,
//     preConfirm: () => {
//       const name = (document.getElementById('swal-name') as HTMLInputElement)?.value.trim()
//       const email = (document.getElementById('swal-email') as HTMLInputElement)?.value.trim()
//       const password = (document.getElementById('swal-password') as HTMLInputElement)?.value
//       const role = (document.getElementById('swal-role') as HTMLSelectElement)?.value

//       if (!name || !email || !password || password.length < 6 || !role) {
//         Swal.showValidationMessage('Semua field wajib diisi dan password minimal 6 karakter')
//         return
//       }

//       return { name, email, password, role }
//     }
//   })

//   if (formValues) {
//     await submitUserPayload(formValues)
//   }
// }

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

const handleBatchDelete = async () => {
  if (selected.value.length === 0) {
    alert('No users selected.')
    return
  }
  
  const selectedUsers = selected.value.map(i => users.value[i])
  const idsToDelete = selectedUsers.map(u => u.id)
  const total = idsToDelete.length

  if (total === 0) {
    Swal.fire('Oops', 'Tidak ada user yang dipilih.', 'warning')
    return
  }

  let confirmText = 'delete users'
  let warningMessage = `Ketik '${confirmText}' untuk menghapus ${total} user.`

  if (total > 5) {
    confirmText = 'permanently delete users'
    warningMessage = `⚠️ Kamu akan menghapus *banyak user secara permanen*.\n\nKetik '${confirmText}' untuk melanjutkan.`
  }

  const { value: input } = await Swal.fire({
    title: 'Konfirmasi Hapus',
    input: 'text',
    inputLabel: warningMessage,
    inputPlaceholder: `Ketik: ${confirmText}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
    preConfirm: (val) => {
      if (val !== confirmText) {
        Swal.showValidationMessage(`Kamu harus mengetik '${confirmText}'`)
      }
    }
  })

  if (input !== confirmText) return

  console.log('Batch deleting:', idsToDelete)

  try {
    // Gunakan Promise.all untuk menghapus secara paralel
    const deleteRequests = idsToDelete.map(id =>
      fetch(`${config.BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
    )

    const responses = await Promise.all(deleteRequests)

    // Cek jika ada request yang gagal
    const hasFailed = responses.some(res => !res.ok)

    if (hasFailed) {
      const errors = await Promise.all(responses.map(res => res.json()))
      const failedMessages = errors.map((r, i) =>
        responses[i].ok ? null : r.message || `Gagal hapus user dengan ID ${idsToDelete[i]}`
      ).filter(Boolean)

      throw new Error(failedMessages.join(', '))
    }

    Swal.fire('Dihapus!', 'Semua user berhasil dihapus.', 'success')
    await fetchUsers()
    selected.value = []
  } catch (err: any) {
    Swal.fire('Error', `Gagal hapus user: ${err.message}`, 'error')
  }
}
</script>