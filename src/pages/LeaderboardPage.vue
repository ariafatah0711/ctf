<template>
    <Navbar />
  
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4 text-blue-600">🏆 Leaderboard</h1>
  
      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else>
        <table class="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead class="bg-blue-100 text-left">
            <tr>
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Username</th>
              <th class="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in leaderboard" :key="user.user_id" class="border-b hover:bg-gray-100">
              <td class="px-4 py-2">{{ user.rank }}</td>
              <td class="px-4 py-2">{{ user.username }}</td>
              <td class="px-4 py-2 font-semibold">{{ user.total_solve_count }}</td>
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
   
   onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/challenges/leaderboard', {
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