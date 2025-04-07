<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
      🏆 Leaderboard
    </h1>

    <div v-if="loading" class="text-gray-500 dark:text-gray-400">Loading...</div>

    <div v-else>
      <div v-if="leaderboard.length > 0" class="flex flex-col">
        <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          <table class="w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
            <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
              <tr>
                <th class="w-[60px] px-4 py-2 text-center">Rank</th>
                <th class="px-4 py-2 text-left">Username</th>
                <th class="w-[80px] px-4 py-2 text-center">Solved</th>
                <th class="w-[80px] px-4 py-2 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in leaderboard"
                :key="user.user_id"
                class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
                @click="goToUser(user.username)"
              >
                <td class="px-4 py-2 text-center font-medium dark:text-white">{{ user.rank }}</td>
                <td class="px-4 py-2 truncate dark:text-white" :title="user.username">{{ user.username }}</td>
                <td class="px-4 py-2 text-center font-semibold dark:text-white">{{ user.solved }}</td>
                <td class="px-4 py-2 text-center font-semibold dark:text-white">{{ user.score }}</td>
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
    score: number;
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
      console.log(raw)
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