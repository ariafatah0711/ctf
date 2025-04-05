<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">🏆 Leaderboard</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else>
      <div v-if="leaderboard.length > 0" class="flex flex-col">
        <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200">
          <table class="w-full">
            <thead class="border-b border-slate-200 bg-slate-100 text-sm font-medium text-slate-600">
              <tr>
                <th class="px-2.5 py-2 text-start">#</th>
                <th class="px-2.5 py-2 text-start">Username</th>
                <th class="px-2.5 py-2 text-start">Solved</th>
              </tr>
            </thead>
            <tbody>
              <!-- <tr
                v-for="(user, i) in leaderboard"
                :key="user.user_id"
                class="border-b border-slate-200 last:border-0"
                @click="goToUser(user.username)"
              > -->
                <tr
                  v-for="user in leaderboard"
                  :key="user.user_id"
                  class="border-b border-slate-200 last:border-0"
                  @click="goToUser(user.username)"
                >
                <td class="p-3 font-medium">{{ user.rank }}</td>
                <td class="p-3">{{ user.username }}</td>
                <td class="p-3 font-semibold">{{ user.solved }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav aria-label="Leaderboard pagination" class="flex justify-center mt-6">
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

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data leaderboard untuk ditampilkan.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import { ref, onMounted, watch } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import config from "../config"

  const router = useRouter();
  const auth = useAuthStore();

  interface LeaderboardUser {
    user_id: string;
    username: string;
    solved: number;
    rank: number;
  }

  const leaderboard = ref<LeaderboardUser[]>([]);
  const loading = ref(true);
  const page = ref(1);
  const totalPages = ref(1);

  const fetchLeaderboard = async () => {
    loading.value = true;
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/leaderboard?page=${page.value}&limit=9`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const raw = await res.json();
      // console.log(raw)
      leaderboard.value = Array.isArray(raw.leaderboard) ? raw.leaderboard : [];
      totalPages.value = raw.totalPages || 1;
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      leaderboard.value = [];
      totalPages.value = 1;
    } finally {
      loading.value = false;
    }
  };

  const goToUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const nextPage = () => {
    if (page.value < totalPages.value) page.value++;
  };
  const prevPage = () => {
    if (page.value > 1) page.value--;
  };
  const setPage = (n: number) => {
    if (n !== page.value) {
      page.value = n;
    }
  };

  onMounted(fetchLeaderboard);
  watch(page, fetchLeaderboard);
</script>