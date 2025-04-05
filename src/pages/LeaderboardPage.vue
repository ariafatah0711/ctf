<template>
  <Navbar />

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">🏆 Leaderboard</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else>
      <div v-if="leaderboard.length > 0" class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table class="min-w-full text-left text-sm font-light text-surface dark:text-white">
                <thead class="border-b border-neutral-200 bg-white font-medium dark:border-white/10 dark:bg-body-dark">
                  <tr>
                    <th scope="col" class="px-6 py-4">#</th>
                    <th scope="col" class="px-6 py-4">Username</th>
                    <th scope="col" class="px-6 py-4">Solved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in leaderboard"
                    :key="user.user_id"
                    @click="goToUser(user.username)"
                    class="border-b border-neutral-200 bg-black/[0.02] dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition"
                  >
                    <td class="whitespace-nowrap px-6 py-4 font-medium">{{ user.rank }}</td>
                    <td class="whitespace-nowrap px-6 py-4">{{ user.username }}</td>
                    <td class="whitespace-nowrap px-6 py-4 font-semibold">{{ user.solved }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav aria-label="Leaderboard pagination" class="flex justify-center mt-6">
          <ul class="list-style-none flex gap-1">
            <li>
              <button
                @click="prevPage"
                :disabled="page === 1"
                class="relative block rounded px-3 py-1.5 text-sm transition duration-300 dark:text-neutral-400 text-surface/50 disabled:pointer-events-none"
              >
                Previous
              </button>
            </li>

            <li v-for="n in totalPages" :key="n">
              <button
                @click="setPage(n)"
                :class="[
                  'relative block rounded px-3 py-1.5 text-sm transition duration-300',
                  page === n
                    ? 'bg-primary-100 text-primary-700 font-medium dark:bg-slate-900 dark:text-primary-500'
                    : 'bg-transparent text-surface hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700'
                ]"
              >
                {{ n }}
              </button>
            </li>

            <li>
              <button
                @click="nextPage"
                :disabled="page === totalPages"
                class="relative block rounded px-3 py-1.5 text-sm transition duration-300 dark:text-neutral-400 text-surface/50 disabled:pointer-events-none"
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