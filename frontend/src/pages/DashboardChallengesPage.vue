<template class="min-h-screen">
    <Navbar />
    <div class="h-16"></div>
    <Breadcrumbs />
  
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6 text-blue-600">🛠️ Manage Challenges</h1>
  
      <div class="flex justify-between items-center mb-4">
        <button
          @click="handleAddChallenge"
          class="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Challenge
        </button>
      </div>
  
      <div v-if="loading" class="text-gray-500">Loading challenges...</div>
      <div v-else>
        <div v-if="challenges.length > 0" class="overflow-x-auto">
          <!-- <ChallengesTable
            :challenges="challenges"
            @edit="handleEditChallenge"
            @delete="handleDeleteChallenge"
          /> -->
          <!-- Pagination -->
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
//   import ChallengesTable from '../components/ChallengesTable.vue'
  
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
      challenges.value = data.data || []
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
  const handleAddChallenge = async () => {
    // Logic to add a new challenge
  }
  
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
</script>  