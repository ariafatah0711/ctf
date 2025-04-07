<template class="min-h-screen bg-gray-50">
  <Navbar />
  <div class="h-16"></div>
  
  <div class="p-4 max-w-screen-xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">🚩 Challenges</h1> 
    <div class="flex flex-col md:flex-row m-0 pb-6">
        <Breadcrumbs />
        <SubmitFlag class="w-full md:w-auto flex-1" />
    </div>

    <!-- Display Challenge Data -->
    <div v-if="challenge" :class="['shadow-lg rounded-lg p-6 transition truncate',
      solved ? 'bg-green-100 dark:bg-green-700' : 'bg-white dark:bg-gray-800']">
      <h1 class="text-3xl font-semibold text-gray-800 mb-3 truncate">{{ challenge.title }}</h1>
      <p class="text-sm text-gray-500 mb-6">{{ formattedDate(challenge.created_at) }}</p>
  
      <div class="mb-6">
        <span class="text-sm px-4 py-2 rounded-full font-medium" :class="badgeColor(challenge.difficulty)">
          {{ difficultyLabel(challenge.difficulty) }}
        </span>
      </div>
  
      <!-- <div class="text-sm text-gray-700 mb-6 break-words whitespace-pre-line">
        {{ challenge.description || 'No description available.' }}
      </div> -->
      <!-- <div class="text-sm text-gray-700 mb-6 break-words whitespace-pre-line" v-html="formatText(challenge.description || 'No description available.')"></div> -->
      <div class="prose prose-sm max-w-none text-sm text-gray-700 mb-6 break-words" v-html="formatText(challenge.description)"></div>

      <!-- New: Display Hint -->
      <div v-if="challenge.hint" class="bg-yellow-50 p-4 rounded-md mb-6 border-l-4 border-yellow-400 break-words">
        <h3 class="font-semibold text-yellow-700 mb-1">Hint</h3>
        <!-- <p class="text-sm text-yellow-700 whitespace-pre-line">{{ challenge.hint }}</p> -->
        <p class="text-sm text-yellow-700 whitespace-pre-line" v-html="formatText(challenge.hint)"></p>
      </div>
      <div v-else>
        <p class="text-sm text-gray-500">No hint available for this challenge.</p>
      </div>
  
      <div class="flex flex-wrap gap-2 text-xs text-white mb-6 truncate">
        <span v-for="tag in challenge.tags" :key="tag" class="bg-gray-700 px-3 py-1 rounded-full">
          #{{ tag }}
        </span>
      </div>

      <div v-if="challenge.url" class="mt-6 truncate">
        <div v-if="isFile(challenge.url)">
          <a
            :href="challenge.url"
            download
            class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition duration-200"
          >
            <i class="fas fa-download mr-2"></i>
            Download
            <!-- {{ challenge.url.split('/').pop() }} -->
          </a>
        </div>
        <div v-else>
          <a
            :href="challenge.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg transition duration-200"
          >
            <i class="fas fa-link mr-2"></i>
            Open
            <!-- {{ challenge.url }} -->
          </a>
        </div>
      </div>
    </div>
  
    <!-- Display Solvers -->
    <div v-if="solvers.length" class="mt-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Solvers</h2>
      <ul>
        <router-link
          v-for="solver in solvers"
          :key="solver.user_id"
          :to="`/profile/${solver.username}`"
          class="block"
        >
          <li class="flex justify-between py-3 px-6 border-b border-gray-200 hover:bg-gray-50 transition">
            <span class="font-medium text-gray-800">{{ solver.username }}</span>
            <span class="text-sm text-gray-500">{{ formattedDate(solver.completed_at) }}</span>
          </li>
        </router-link>
      </ul>
    </div>

    <div v-else class="mt-8">
      <p class="text-gray-500 italic">Belum ada yang menyelesaikan challenge ini.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import SubmitFlag from '../components/SubmitFlag.vue';
import Breadcrumbs from "../components/Breadcrumbs.vue"
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import config from "../config"
import { marked } from 'marked';

const auth = useAuthStore();

const route = useRoute();
const challenge = ref<any>(null);
const solvers = ref<any[]>([]);
const solved = ref(false);

const formatText = (text: string) => marked.parse(text || '');

const fetchChallenge = async (id: string) => {
  try {
    const res = await fetch(`${config.BASE_URL}/api/challenges/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const data = await res.json();
    challenge.value = data.data.challenge;
    solvers.value = data.data.solvers; // Menyimpan data solvers
    solved.value = data.data.solved;
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

// Function to check if the URL points to a file
const isFile = (url: string): boolean => {
  return /\.(pdf|zip|txt|png|jpg|jpeg|mp4|mp3|docx)$/i.test(url);
};
</script>
