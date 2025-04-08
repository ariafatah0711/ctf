<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
        🛠️ Manage Challenges
      </h1>
    </div>

    <div class="flex flex-row items-center justify-between gap-4">
      <Breadcrumbs class="w-full sm:w-auto flex-1" />
      <div v-if="!loading" class="flex gap-2">
        <IconButton @click="showAddChallengeModal" :icon="PlusIcon" label="Add Challenge" color="blue" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div v-if="challenges.length > 0" class="overflow-x-auto mt-4">
        <BaseTable
          :columns="[
            { label: 'Challenge Name', key: 'challenge', grow: true },
            { label: 'Category', key: 'tags', width: 'w-40' },
            { label: 'Difficulty', key: 'difficulty', width: 'w-35' }
          ]"
          :rows="challenges"
          @edit="showEditChallengeModal"
          @delete="deleteChallenge"
        >
          <template #challenge="{ row }">
            <div class="flex flex-col">
              <span class="font-medium dark:text-white">{{ row.title }}</span>
            </div>
          </template>

          <template #difficulty="{ row }">
            <span class="dark:text-slate-200">{{ levelMap[row.difficulty] || 'Tidak Diketahui' }}</span>
          </template>
        </BaseTable>

        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @update:page="setPage"
        />
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data tantangan.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import config from '../config'
  import Navbar from '../components/Navbar.vue'
  import Breadcrumbs from "../components/Breadcrumbs.vue"
  import IconButton from "../components/IconButton.vue"
  import { PlusIcon } from "@heroicons/vue/24/solid"
  import GlobalSwal from "../utills/GlobalSwal"
  import BaseTable from '../components/BaseTable.vue'
  import Pagination from '../components/Pagination.vue'
  import { swalSuccess, swalError, swalAlert } from '@/utills/swalAlert'

  const Swal = GlobalSwal
  const auth = useAuthStore()
  
  const challenges = ref<any[]>([])
  const loading = ref(true)
  
  const page = ref(1)
  const limit = 25
  const totalPages = ref(1)

  const levelMap = {
    1: 'Easy 🟢',
    2: 'Medium 🟡',
    3: 'Hard 🔴'
  }
  
  const fetchChallenges = async () => {
    loading.value = true
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges?page=${page.value}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      })
      const data = await res.json()
      const data_challenges = data.data.map(challenge => ({
        ...challenge,
        tags: Array.isArray(challenge.tags) ? challenge.tags.join(', ') : ''
      }))
      // console.log(data_challenges)
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

  // Add Challenge
  const handleAddChallenge = async (challengeData) => {
    try {
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
      await fetchChallenges(); // refresh data
    } catch (err) {
      console.error(err);
      swalError("Gagal menambahkan challenge.", err.message || '');
    }
  };

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
    } catch (err) {
      console.error(err);
      swalError("Gagal menghapus challenge.", err.message || '');
    }
  };

  const handleEditChallenge = async (id: string, updatedData: any) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
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
    } catch (err) {
      console.error(err);
      swalError("Gagal memperbarui challenge.", err.message || '');
    }
  };

  const showChallengeModal = async (
    type: 'add' | 'edit',
    initialData: any = {}
    ) => {
      const {
        title = '',
        description = '',
        flag = '',
        url = '',
        tags = [],
        hint = '',
        difficulty = ''
      } = initialData;

    const { value: formValues } = await Swal.fire({
      title: type === 'add' ? 'Tambah Challenge Baru' : 'Edit Challenge',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-title" class="swal2-input" placeholder="Judul Challenge" value="${title}" />
          <textarea id="swal-description" class="swal2-textarea" placeholder="Deskripsi">${description}</textarea>
          <input id="swal-flag" class="swal2-input" placeholder="${config.FLAG_FORMAT}" value="${flag}" />
          <input id="swal-url" class="swal2-input" placeholder="URL Challenge" value="${url}" />
          <input id="swal-tags" class="swal2-input" placeholder="Tags (pisahkan dengan koma)" value="${tags}" />
          <input id="swal-hint" class="swal2-input" placeholder="Hint (opsional)" value="${hint}" />
          <select id="swal-difficulty" class="swal2-select">
            <option value="" disabled ${!difficulty ? 'selected' : ''}>Pilih Tingkat Kesulitan</option>
            <option value="1" ${difficulty == 1 ? 'selected' : ''}>🟢 Easy</option>
            <option value="2" ${difficulty == 2 ? 'selected' : ''}>🟡 Medium</option>
            <option value="3" ${difficulty == 3 ? 'selected' : ''}>🔴 Hard</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement)?.value.trim();
        const description = (document.getElementById('swal-description') as HTMLTextAreaElement)?.value.trim();
        const flag = (document.getElementById('swal-flag') as HTMLInputElement)?.value.trim();
        const url = (document.getElementById('swal-url') as HTMLInputElement)?.value.trim();
        const tags = (document.getElementById('swal-tags') as HTMLInputElement)?.value.trim();
        const hint = (document.getElementById('swal-hint') as HTMLInputElement)?.value.trim();
        const difficulty = Number((document.getElementById('swal-difficulty') as HTMLSelectElement)?.value);

        if (!title || !description || !flag || !url || !difficulty) {
          Swal.showValidationMessage("Semua field wajib diisi (kecuali hint dan tags)");
          return;
        }

        return {
          title,
          description,
          flag,
          url,
          difficulty,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          hint: hint || ''
        };
      }
    });

    if (formValues) {
      if (type === 'add') {
        await handleAddChallenge(formValues);
      } else if (type === 'edit' && initialData?.id) {
        await handleEditChallenge(initialData.id, formValues);
      }
    }
  };

  const showAddChallengeModal = () => showChallengeModal('add');

  const showEditChallengeModal = async (index: number) => {
    if (!Array.isArray(challenges.value) || index < 0 || index >= challenges.value.length) {
      return swalError("Challenge tidak ditemukan di index tersebut.");
    }

    const challenge = challenges.value[index];

    if (!challenge?.id) {
      return swalError("ID challenge tidak ditemukan.");
    }

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
      console.log("Detail challenge (admin):", data);

      showChallengeModal('edit', data); // tampilkan modal dengan data lengkap
    } catch (err: any) {
      console.error(err);
      swalError("Terjadi kesalahan saat mengambil data challenge.", err.message || '');
    }
  };
</script>