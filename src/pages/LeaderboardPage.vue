<template>
  <Navbar />

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-blue-600">🏆 Leaderboard</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Rank</th>
            <th scope="col" class="px-6 py-3">Username</th>
            <th scope="col" class="px-6 py-3">Solved</th>
          </tr>
        </thead>
        <tbody>
          <tr
          v-for="user in leaderboard"
            :key="user.user_id"
            @click="goToUser(user.username)"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition"
          >
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ user.rank }}
            </th>
            <td class="px-6 py-4">{{ user.username }}</td>
            <td class="px-6 py-4 font-semibold">{{ user.total_solve_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import config from "../config"

const router = useRouter();

interface LeaderboardUser {
  user_id: string;
  username: string;
  total_solve_count: number;
  rank: number;
}

const leaderboard = ref<LeaderboardUser[]>([]);
const loading = ref(true);
const auth = useAuthStore();
const token = auth.token;

// ✅ Pindahkan ke luar
const goToUser = (username: string) => {
  router.push(`/profile/${username}`);
};

onMounted(async () => {
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const raw = await res.json();
    console.log('Raw leaderboard:', raw);

    const leaderboardData = Array.isArray(raw.leaderboard) ? raw.leaderboard : [];

    if (!Array.isArray(leaderboardData)) {
      throw new Error('Leaderboard response is not an array');
    }

    leaderboard.value = leaderboardData;
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  } finally {
    loading.value = false;
  }
});
</script>