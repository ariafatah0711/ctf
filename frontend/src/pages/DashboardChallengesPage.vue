<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
        🛠️ Manage Challenges
      </h1>
    </div>

    <div class="flex flex-wrap justify-center items-center gap-4">
      <Breadcrumbs class="w-full sm:w-auto flex-1" :extra-items="[{ name: 'Upload', href: '/dashboard/upload' }]" />
      <div v-if="!loading" class="flex gap-2">
        <IconButton @click="handleActive" :icon="CheckCircleIcon" label="Status" color="gray" />
        <IconButton @click="showAddChallengeModal" :icon="PlusIcon" label="Add" color="blue" />
        <IconButton @click="showAddBatchChallengeModal" :icon="DocumentArrowUpIcon" label="Batch" color="green" />
        <IconButton @click="handleBatchDelete" :icon="TrashIcon" label="Delete" color="red" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div v-if="challenges.length > 0" class="overflow-x-auto mt-4">
        <BaseTable
          :min-width="'800px'"
          :columns="[
            { label: 'Challenge Name', key: 'challenge', grow: true },
            { label: 'status', key: 'active', width: 'w-25' },
            { label: 'Difficulty', key: 'difficulty', width: 'w-30' },
            { label: 'Category', key: 'tags', width: 'w-40' }
          ]"
          :rows="challenges"
          @edit="showEditChallengeModal"
          @delete="deleteChallenge"
          :selected="selected"
          @update:selected="selected = $event"
        >
          <template #challenge="{ row }">
            <div class="flex flex-col">
              <span class="font-medium dark:text-white">{{ row.title }}</span>
            </div>
          </template>

          <template #difficulty="{ row }">
            <span
              :class="{
                'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300': row.difficulty === 1,
                'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300': row.difficulty === 2,
                'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300': row.difficulty === 3,
              }"
              class="px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ levelMap[row.difficulty] || 'Tidak Diketahui' }}
            </span>
          </template>

          <template #active="{ row }">
            <span
              :class="row.active
                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
                : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'"
              class="px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ row.active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </template>
        </BaseTable>
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data tantangan.
      </div>

      <div class="flex justify-center">
        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @update:page="setPage"
        />
      </div>
    </div>
  </div>

  <!-- Modal Challenge Form -->
  <Teleport to="body">
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <ChallengeForm
        :type="formType"
        :initialData="formData"
        @cancel="showForm = false"
        @submit="(data) => {
          if (formType === 'add') {
            handleAddChallenge(data)
          } else {
            handleEditChallenge(data)
          }
          showForm.value = false
        }"
      />
      <button
        @click="showForm = false"
        class="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition duration-200 z-50"
        aria-label="Tutup form">❌</button>
    </div>
    <div v-if="showBatchForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <BatchForm
          v-model:visible="showBatchForm"
          title="➕ Batch Tambah Challenge"
          format="title, description, flag, url, difficulty, tags, hint"
          :placeholder="`SQL Injection,Deskripsi serangan SQL,flag{123},https://ctf.local,1,web;pentest,Hint opsional\nXSS Challenge,Serangan XSS dasar,flag{456},https://ctf.local/xss,2,xss;web,`"
          :fields="['title', 'description', 'flag', 'url', 'difficulty', 'tags', 'hint']"
          :transform="(entry) => {
            const diff = Number(entry.difficulty)
            if (!diff || isNaN(diff)) {
              swalError('Difficulty harus angka: ' + entry.difficulty)
              return false
            }

            return {
              ...entry,
              difficulty: diff,
              tags: entry.tags.split(';').map(t => t.trim()).filter(Boolean),
              active: false
            }
          }"
          @cancel="showBatchForm = false"
          @submit="handleBatchSubmit"
        />
      <button
        @click="showBatchForm = false"
        class="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition duration-200 z-50"
        aria-label="Tutup form">❌</button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import config from '../config'
  import Breadcrumbs from "../components/Breadcrumbs.vue"
  import IconButton from "../components/IconButton.vue"
  import {
    PlusIcon,
    TrashIcon,
    DocumentArrowUpIcon,
    CheckCircleIcon,
  } from "@heroicons/vue/24/solid";
  import GlobalSwal from "../utills/GlobalSwal"
  import BaseTable from '../components/BaseTable.vue'
  import Pagination from '../components/Pagination.vue'
  import ChallengeForm from "../components/dashboard/ChallengeForm.vue"
  import BatchForm from '../components/dashboard/BatchForm.vue'
  import { swalSuccess, swalError } from '../utills/swalAlert'

  const Swal = GlobalSwal
  const auth = useAuthStore()
  
  const challenges = ref<any[]>([])
  const loading = ref(true)
  
  const page = ref(1)
  const limit = 25
  const totalPages = ref(1)
  const selected = ref<number[]>([])

  const showForm = ref(false);
  const showBatchForm = ref(false);
  const formType = ref('add');
  const formData = ref({});

  const levelMap = {
    1: 'Easy 🟢',
    2: 'Medium 🟡',
    3: 'Hard 🔴'
  }

  function openForm(type = 'add', data = {}) {
    formType.value = type;
    formData.value = data;
    showForm.value = true;
  }

  const fetchChallenges = async () => {
    loading.value = true
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges?page=${page.value}&limit=${limit}&active=all`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const data = await res.json()
      const data_challenges = data.data.map(challenge => ({
        ...challenge,
        tags: Array.isArray(challenge.tags) ? challenge.tags.join(', ') : ''
      }))
      console.log(data_challenges)
      challenges.value =  data_challenges || []
      totalPages.value = data.totalPages || 1
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchChallenges()
  })
  
  watch(page, async () => {
    await fetchChallenges()
    selected.value = []
  })
  
  const setPage = (n: number) => {
    if (n !== page.value) {
      page.value = n
    }
  }

  const showAddChallengeModal = () => openForm();
  const handleAddChallenge = async (challengeData: any) => {
    try {
      if (isNaN(Number(challengeData.difficulty))) {
        throw new Error("Difficulty harus berupa angka.");
      }

      challengeData.difficulty = Number(challengeData.difficulty);

      const res = await fetch(`${config.BASE_URL}/api/challenges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(challengeData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      await swalSuccess("Challenge berhasil ditambahkan!");
      await fetchChallenges();
      showForm.value = false;
    } catch (err: any) {
      console.error(err);
      swalError("Gagal menambahkan challenge.", err.message || '');
    }
  };

  const handleEditChallenge = async (updatedData: any) => {
    try {
      if (!updatedData.id) throw new Error("ID challenge tidak ditemukan.");
      console.log("formData (before open form):", JSON.stringify(updatedData));

      const res = await fetch(`${config.BASE_URL}/api/challenges/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      await swalSuccess("Challenge berhasil diperbarui!");
      await fetchChallenges();
      showForm.value = false;
    } catch (err: any) {
      console.error(err);
      swalError("Gagal memperbarui challenge.", err.message || '');
    }
  };

  const showEditChallengeModal = async (index: number) => {
    if (!Array.isArray(challenges.value) || index < 0 || index >= challenges.value.length) return swalError("Challenge tidak ditemukan di index tersebut.");
    const challenge = challenges.value[index];
    if (!challenge?.id) return swalError("ID challenge tidak ditemukan.");
  
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/${challenge.id}?detail=true`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Gagal mengambil detail challenge.");
      }

      const { data } = await res.json();

      openForm('edit', data);
    } catch (err: any) {
      console.error(err);
      swalError("Terjadi kesalahan saat mengambil data challenge.", err.message || '');
    }
  };

  const showAddBatchChallengeModal = () => showBatchForm.value = true;
  const handleBatchSubmit = async (parsedData: any) => {
    try {
      await Promise.all(parsedData.map(data =>
        fetch(`${config.BASE_URL}/api/challenges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.user.token}`,
          },
          body: JSON.stringify(data)
        })
      ))

      await swalSuccess(`✅ ${parsedData.length} challenge berhasil ditambahkan!`)
      showBatchForm.value = false
      await fetchChallenges()
    } catch (err) {
      swalError('Gagal menambahkan challenge', err.message)
    }
  }

  const deleteChallenge = async (index: number) => {
    const challenge = challenges.value[index];
    const id = challenge?.id;

    if (!id) return swalError("ID challenge tidak ditemukan");

    const confirm = await Swal.fire({
      title: 'Yakin?',
      text: `Hapus challenge "${challenge.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      await swalSuccess("Challenge berhasil dihapus.");
      await fetchChallenges(); // Refresh list
    } catch (err: any) {
      console.error(err);
      swalError("Gagal menghapus challenge.", err.message || '');
    }
  };

  const handleActive = async () => {
    const selectedChallenges = selected.value.map(i => challenges.value[i]);
    const total = selectedChallenges.length;

    if (total === 0) {
      return Swal.fire('Oops', 'Tidak ada challenge yang dipilih.', 'warning');
    }

    const { isConfirmed, value: status } = await Swal.fire({
      title: 'Konfirmasi',
      text: `Ubah status ${total} challenge ke?`,
      input: 'select',
      inputOptions: {
        aktif: 'Aktif',
        nonaktif: 'Nonaktif',
      },
      inputPlaceholder: 'Pilih status',
      showCancelButton: true,
      confirmButtonText: 'Ya, ubah',
      cancelButtonText: 'Batal',
      preConfirm: (status) => {
        if (!status) {
          Swal.showValidationMessage('Pilih status dulu ya.');
          return false;
        }
        return status;
      },
    });

    if (!isConfirmed) return;

    const isActive = status === "aktif";

    try {
      await Promise.all(
        selectedChallenges.map(challenge =>
          fetch(`${config.BASE_URL}/api/challenges/${challenge.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.user.token}`,
            },
            body: JSON.stringify({ changeStatus: isActive }),
          })
        )
      );

      await fetchChallenges();
      Swal.fire('Berhasil!', `${total} challenge berhasil diperbarui.`, 'success');
      selected.value = []
    } catch (err) {
      Swal.fire('Gagal', `Terjadi kesalahan: ${err.message}`, 'error');
    }
  };

  const handleBatchDelete = async () => {
    if (selected.value.length === 0) {
      swalError('Tidak ada challenge yang dipilih.')
      return
    }

    const selectedChallenges = selected.value.map(i => challenges.value[i])
    const idsToDelete = selectedChallenges.map(c => c.id)
    const total = idsToDelete.length

    if (total === 0) {
      Swal.fire('Oops', 'Tidak ada challenge yang dipilih.', 'warning')
      return
    }

    let confirmText = 'delete challenges'
    let warningMessage = `Ketik '${confirmText}' untuk menghapus ${total} challenge.`

    if (total > 5) {
      confirmText = 'permanently delete challenges'
      warningMessage = `⚠️ Kamu akan menghapus *banyak challenge secara permanen*.\n\nKetik '${confirmText}' untuk melanjutkan.`
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
      const deleteRequests = idsToDelete.map(id =>
        fetch(`${config.BASE_URL}/api/challenges/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        })
      )

      const responses = await Promise.all(deleteRequests)

      const hasFailed = responses.some(res => !res.ok)

      if (hasFailed) {
        const errors = await Promise.all(responses.map(res => res.json()))
        const failedMessages = errors.map((r, i) =>
          responses[i].ok ? null : r.message || `Gagal hapus challenge dengan ID ${idsToDelete[i]}`
        ).filter(Boolean)

        throw new Error(failedMessages.join(', '))
      }

      Swal.fire('Dihapus!', 'Semua challenge berhasil dihapus.', 'success')
      await fetchChallenges()
      selected.value = []
    } catch (err: any) {
      Swal.fire('Error', `Gagal hapus challenge: ${err.message}`, 'error')
    }
  }
</script>