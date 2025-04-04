<template>
    <Navbar />
    <div class="p-6 max-w-3xl mx-auto">
      <div v-if="loading" class="text-gray-500">Memuat profil...</div>
      <div v-else-if="error" class="text-red-500">Gagal memuat profil: {{ error }}</div>
      <div v-else>
        <h1 class="text-2xl font-bold text-blue-600 mb-4">👤 Profil: {{ user.username }}</h1>
  
        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:text-white">
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
  
          <div v-if="user.solves && user.solves.length" class="mt-6">
            <h2 class="text-xl font-semibold text-green-600 mb-2">✅ Solved Challenges</h2>
            <ul class="list-disc list-inside space-y-1">
                <li v-for="challenge in user.solves" :key="challenge.id">
                    <RouterLink
                    :to="`/challenges/${challenge.id}`"
                    class="text-blue-600 hover:underline"
                    >
                    {{ challenge.title }}
                    </RouterLink>
                </li>
            </ul>
          </div>
          <div v-else class="mt-6 text-gray-400 italic">
            Belum menyelesaikan challenge apapun.
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import Navbar from '../components/Navbar.vue';
  import { RouterLink } from 'vue-router';
  import config from '../config';  
  
  const route = useRoute();
  const username = route.params.username as string;
  
  const user = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  
  const auth = useAuthStore();
  const token = auth.token;
  
  onMounted(async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/users/username?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal ambil data');
  
      user.value = result.data;
      console.log(result.data);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
</script>