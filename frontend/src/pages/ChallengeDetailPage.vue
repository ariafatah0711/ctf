<template>  
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-lg">
      <h1 class="text-2xl font-bold text-blue-600 mb-6 text-center sm:text-left">🚩 Challenges</h1> 

      <!-- Breadcrumb & Submit -->
      <div class="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <Breadcrumbs />
        <SubmitFlag class="w-full md:w-auto" />
      </div>

      <!-- Challenge Detail -->
      <div
        v-if="challenge"
        :class="[
          'rounded-2xl p-6 border shadow-sm transition',
          solved ? 'bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
        ]"
      >
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-1 truncate">
          {{ challenge.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ formattedDate(challenge.created_at) }}</p>

        <!-- Difficulty Badge -->
        <div class="mb-4">
          <span class="text-xs px-3 py-1 rounded-full font-semibold" :class="badgeColor(challenge.difficulty)">
            {{ difficultyLabel(challenge.difficulty) }}
          </span>
        </div>

        <!-- Description -->
        <div class="text-sm text-gray-800 dark:text-gray-300 space-y-4 prose prose-sm dark:prose-invert max-w-none mb-6 break-words"
          v-html="formatText(challenge.description)">
        </div>

        <!-- Hint -->
        <div v-if="challenge.hint" class="bg-yellow-50 dark:bg-yellow-800 p-4 rounded-lg mb-6 border-l-4 border-yellow-400 dark:border-yellow-500">
          <h3 class="font-semibold text-yellow-700 dark:text-yellow-100 mb-1">💡 Hint</h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-50 whitespace-pre-line" v-html="formatText(challenge.hint)"></p>
        </div>

        <!-- No Hint -->
        <div v-else class="text-sm text-gray-500 italic mb-6">
          Tidak ada hint untuk challenge ini.
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 text-xs mb-6">
          <span
            v-for="tag in challenge.tags"
            :key="tag"
            class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white px-3 py-1 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- URL / Download -->
        <div v-if="challenge.url" class="mt-8">
          <button
            @click="handleDownload"
            class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition duration-200 shadow-sm"
            :class="isFile(challenge.url)
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-green-600 hover:bg-green-700'"
          >
            <i :class="isFile(challenge.url) ? 'fas fa-download' : 'fas fa-link'"></i>
            <span>{{ isFile(challenge.url) ? 'Download File' : 'Open Link' }}</span>
          </button>
        </div>
      </div>

      <!-- Solvers -->
      <div v-if="solvers.length" class="mt-10">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">🧠 Solvers</h2>
        <ul class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
          <router-link
            v-for="solver in solvers"
            :key="solver.user_id"
            :to="`/profile/${solver.username}`"
            class="block hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <li class="flex justify-between py-3 px-6">
              <span class="font-medium text-gray-800 dark:text-white">{{ solver.username }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formattedDate(solver.completed_at) }}</span>
            </li>
          </router-link>
        </ul>
      </div>

      <!-- No Solvers -->
      <div v-else class="mt-10">
        <p class="text-gray-500 italic">Belum ada yang menyelesaikan challenge ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SubmitFlag from '../components/SubmitFlag.vue';
import Breadcrumbs from "../components/Breadcrumbs.vue"
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import config from "../config"
import { marked } from 'marked';
import downloadFileByUrl from "../utills/downloadFile.ts"
import GlobalSwal from "../utills/GlobalSwal";
const Swal = GlobalSwal;

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

    // challenge.value.description = `Line pertama\n\nLine kedua\n\n- Item 1\n- Item 2\n\n**Bold Text**`;
    // console.log('Fetched:', data);
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

const handleDownload = async () => {
  const url = challenge.value?.url;
  if (!url) return;

  if (isFile(url)) {
    // const url = "dfasfsadafsa"
    await downloadFileByUrl(url);
  } else {
    // const url = "https:dancok.id"
    try {
      new URL(url);
      const newWindow = window.open(url, '_blank');

      if (!newWindow) {
        console.warn("⚠️ Window gagal dibuka. Mungkin diblokir oleh popup blocker.");
        await Swal.fire({icon: "warning", title: "Popup diblokir", text: "Silakan izinkan popup untuk membuka file."});}
    } catch (e) {
      console.error("❌ URL tidak valid:", e);
      await Swal.fire({icon: "error", title: "URL tidak valid", text: "Tautan yang diberikan tidak sesuai format URL."});
    }
  }
};

// Function to check if the URL points to a file
const isFile = (url: string): boolean => {
  console.log(url)
  return /\.(pdf|zip|txt|png|jpg|jpeg|mp4|mp3|docx)$/i.test(url);
};
</script>