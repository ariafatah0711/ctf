<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <!-- <div class="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow"> -->
  <div class="p-4 space-y-8">
    <SubmitFlag />

    <div v-if="challenge">
      <h1 class="text-2xl font-bold text-blue-800 mb-2">{{ challenge.title }}</h1>
      <p class="text-gray-600 mb-4">{{ formattedDate(challenge.created_at) }}</p>

      <div class="mb-4">
        <span class="text-sm px-2 py-1 rounded-full font-medium"
              :class="badgeColor(challenge.difficulty)">
          {{ difficultyLabel(challenge.difficulty) }}
        </span>
      </div>

      <div class="text-sm text-gray-700 mb-4">
        {{ challenge.description || 'No description available.' }}
      </div>

      <div class="flex flex-wrap gap-2 text-xs text-white mb-6">
        <span
          v-for="tag in challenge.tags"
          :key="tag"
          class="bg-gray-700 px-2 py-0.5 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- NEW: Button to go to challenge URL -->
      <div v-if="challenge.url" class="mt-4">
        <a :href="withHttp(challenge.url)" target="_blank" rel="noopener"
           class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
          Buka Soal
        </a>
      </div>
    </div>
    <div v-else>
      <p>Loading challenge...</p>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import SubmitFlag from '../components/SubmitFlag.vue';
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import config from "../config"
  
  const auth = useAuthStore();
  
  const route = useRoute();
  const challenge = ref<any>(null);
  
  const fetchChallenge = async (id: string) => {
    try {
    //   const res = await fetch(`http://localhost:3000/api/challenges/${id}`); // Ganti URL ini
      const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await res.json();
      console.log(data)
      // challenge.value = data;
      challenge.value = data.data;
      console.log('Fetched:', data);
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  };
  
  // Pantau perubahan route param `id`
  watch(
    () => route.params.id,
    (id) => {
      if (id && typeof id === 'string') {
        console.log('Route ID:', id);
        fetchChallenge(id);
      }
    },
    { immediate: true }
  );
  
  // Utilitas styling
  const badgeColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return 'bg-green-200 text-green-800';
      case 2:
        return 'bg-yellow-200 text-yellow-800';
      case 3:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };
  
  const difficultyLabel = (difficulty: number) => {
    if (!difficulty || difficulty < 1 || difficulty > 3) return 'Unknown';
    return ['Easy', 'Medium', 'Hard'][difficulty - 1];
  };
  
  const formattedDate = (raw: string) => {
  if (!raw) return 'Unknown date';
  const date = new Date(raw);
  return isNaN(date.getTime()) 
      ? 'Invalid date' 
      : date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
  };

  const withHttp = (url: string): string => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `http://${url}`;
  };
  </script>