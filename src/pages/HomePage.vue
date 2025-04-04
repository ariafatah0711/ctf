<!-- src/pages/HomePage.vue
<template>
    <div class="p-4">
      <h1 class="text-xl font-bold">Selamat datang, {{ auth.username }}</h1>
      <p class="text-green-600">Already logged in ✅</p>
  
      <button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>

    <div v-for="challenge in challenges" :key="challenge.id" class="mb-4 p-4 border rounded">
    <h2 class="font-bold text-lg">{{ challenge.title }}</h2>
    <p>{{ challenge.description }}</p>
    <span class="text-sm text-gray-500">Difficulty: {{ challenge.difficulty }}</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();

  const challenges = ref([]);

  onMounted(async () => {
    try {
      if (!auth.username) {
        await auth.checkAuth();
      }

      const res = await fetch('http://localhost:3000/api/challenges', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal ambil challenge');
      challenges.value = await res.json();
    } catch (err) {
      console.error(err);
    }
  });
  
  const logout = () => {
    auth.logout();
    router.push('/login');
  };
</script> -->

<template>
  <Navbar />

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 bg-amber-300">🧠 Daftar Tantangan</h1>
    <ChallengeList />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import ChallengeList from '../components/ChallengeList.vue';
</script>