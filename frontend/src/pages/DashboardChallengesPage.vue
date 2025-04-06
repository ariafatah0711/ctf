<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
      <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">
        🛠️ Manage Challenges
      </h1>
      <div v-if="!loading" class="flex justify-center sm:justify-end space-x-2">
        <IconButton @click="showAddChallengeModal" :icon="PlusIcon" label="Add Challenge" color="blue" />
      </div>
    </div>

    <div class="flex flex-col md:flex-row m-0 mb-4">
      <Breadcrumbs />
    </div>

    <div v-if="loading" class="text-gray-500">Loading challenges...</div>
    <div v-else>
      <div v-if="challenges.length > 0" class="overflow-x-auto">
        <BaseTable
          :columns="[
            { label: 'Challenge Name', key: 'challenge', grow: true },
            { label: 'Category', key: 'tags', width: 'w-40' },
            { label: 'Difficulty', key: 'difficulty', width: 'w-20' }
          ]"
          :rows="challenges"
          @edit="editChallenge"
          @delete="deleteChallenge"
        >
        <!-- Slot untuk kolom Challenge Name -->
        <template #challenge="{ row }">
          <div class="flex flex-col">
            <span class="font-medium">{{ row.title }}</span>
            <!-- <small class="text-sm text-gray-500">ID: {{ row.id }}</small> -->
          </div>
        </template>
      </BaseTable>
        
        <nav aria-label="Challenges pagination" class="flex justify-center mt-6">
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
                :class="[ 'px-3 py-1.5 rounded', page === n ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-100 hover:bg-gray-200' ]"
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
      <div v-else class="text-center text-gray-500 mt-10">Tidak ada data tantangan.</div>
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

  const Swal = GlobalSwal
  const auth = useAuthStore()
  
  const challenges = ref<any[]>([])
  const loading = ref(true)
  
  const page = ref(1)
  const limit = 25
  const totalPages = ref(1)
  
  const fetchChallenges = async () => {
    loading.value = true
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges?page=${page.value}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
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

  const showAddChallengeModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Challenge Baru',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-title" class="swal2-input" placeholder="Judul Challenge" />
          <textarea id="swal-description" class="swal2-textarea" placeholder="Deskripsi"></textarea>
          <input id="swal-flag" class="swal2-input" placeholder="Flag (ctf{...})" />
          <input id="swal-url" class="swal2-input" placeholder="URL Challenge" />
          <input id="swal-tags" class="swal2-input" placeholder="Tags (pisahkan dengan koma)" />
          <input id="swal-hint" class="swal2-input" placeholder="Hint (opsional)" />
          <select id="swal-difficulty" class="swal2-select">
            <option value="" disabled selected>Pilih Tingkat Kesulitan</option>
            <option value="1">🟢 Mudah</option>
            <option value="2">🟡 Sedang</option>
            <option value="3">🔴 Sulit</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const title = document.getElementById('swal-title')?.value.trim();
        const description = document.getElementById('swal-description')?.value.trim();
        const flag = document.getElementById('swal-flag')?.value.trim();
        const url = document.getElementById('swal-url')?.value.trim();
        const tags = document.getElementById('swal-tags')?.value.trim();
        const hint = document.getElementById('swal-hint')?.value.trim();
        const difficulty = Number(document.getElementById('swal-difficulty')?.value);

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
          hint: hint || ""
        };
      }
    });

    if (formValues) {
      await handleAddChallenge(formValues);
    }
  };
  
  // Add Challenge
  const handleAddChallenge = async (challengeData) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(challengeData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("Challenge berhasil ditambahkan!");
      await fetchChallenges(); // misal kamu ingin refresh data
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan challenge.");
    }
  };

  // // Edit Challenge
  // const handleEditChallenge = async (index: number) => {
  //   // const challenge = challenges.value[index]
  //   // Logic to edit challenge
  //   return
  // }
  
  // // Delete Challenge
  // const handleDeleteChallenge = async (index: number) => {
  //   // const challenge = challenges.value[index]
  //   // Logic to delete challenge
  //   return
  // }

  const deleteChallenge = async (id: string) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert("Challenge berhasil dihapus!");
      await fetchChallenges(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus challenge.");
    }
  };

  const editChallenge = async (id: string, updatedData: any) => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert("Challenge berhasil diperbarui!");
      await fetchChallenges(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui challenge.");
    }
  };
</script>  