<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">🏆 Leaderboard</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else>
      <div v-if="leaderboard.length > 0" class="flex flex-col">
        <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200">
          <table class="w-full table-fixed border border-slate-200 rounded-md overflow-hidden">
            <thead class="bg-slate-100 text-sm font-medium text-slate-600">
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
                class="border-t border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                @click="goToUser(user.username)"
              >
                <td class="px-4 py-2 text-center font-medium">{{ user.rank }}</td>
                <td class="px-4 py-2 truncate" :title="user.username">{{ user.username }}</td>
                <td class="px-4 py-2 text-center font-semibold">{{ user.solved }}</td>
                <td class="px-4 py-2 text-center font-semibold">{{ user.score }}</td>
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