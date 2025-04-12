<template>  
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-lg">
      <h1 class="text-2xl font-bold text-blue-600 mb-6 text-center sm:text-left">🚩 Challenges</h1> 

      <!-- Breadcrumb & Submit -->
      <div class="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <!-- <Breadcrumbs /> -->
        <Breadcrumbs
          :extra-items="[{ name: 'Challenges', href: '__back__' }]"
          extra-position="start"
          :remove-index="0"
        />
        <SubmitFlag class="w-full md:w-auto" />
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="animate-pulse space-y-5 rounded-2xl p-6 border shadow-sm bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <div class="h-7 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>

        <div class="flex gap-2">
          <div class="h-6 w-16 rounded-full bg-gray-300 dark:bg-slate-600"></div>
          <div class="h-6 w-12 rounded-full bg-gray-300 dark:bg-slate-600"></div>
        </div>

        <div class="h-32 bg-gray-200 dark:bg-slate-700 w-full rounded"></div>
        <div class="h-6 bg-yellow-100 dark:bg-yellow-700 w-1/3 rounded"></div>

        <div class="flex flex-wrap gap-2">
          <div class="h-6 w-20 rounded-full bg-gray-300 dark:bg-slate-600"></div>
          <div class="h-6 w-16 rounded-full bg-gray-300 dark:bg-slate-600"></div>
        </div>

        <div class="flex gap-4 mt-6">
          <div class="h-12 w-36 bg-blue-400 rounded-xl"></div>
          <div class="h-12 w-32 bg-blue-100 dark:bg-slate-600 rounded-xl"></div>
        </div>
      </div>

      <!-- Challenge tidak ditemukan atau timeout -->
      <div v-else-if="!challenge && !loading" class="text-center py-10 text-gray-500 dark:text-gray-400">
        Challenge tidak tersedia atau terjadi timeout.
      </div>

      <!-- Challenge Detail -->
      <div v-else :class="['relative rounded-2xl p-6 border shadow-sm transition',
          solved ? 'bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700']">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-1 truncate mr-16">
          {{ challenge.title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ formattedDate(challenge.created_at) }}</p>

        <!-- Difficulty Badge -->
        <div class="mb-4">
          <RouterLink
            :to="{
              path: '/challenges',
              query: { difficulty: challenge.difficulty }
            }"
            class="text-xs px-3 py-1 rounded-full font-semibold"
            :class="badgeColor(challenge.difficulty)"
          >
            {{ difficultyLabel(challenge.difficulty) }}
          </RouterLink>
        </div>

        <!-- Description -->
        <div class="text-sm text-gray-800 dark:text-gray-300 space-y-4 prose prose-sm dark:prose-invert max-w-none mb-6 break-words"
          v-html="formatText(challenge.description)">
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 text-xs mb-6">
          <RouterLink
            v-for="tag in challenge.tags"
            :key="tag"
            :to="{ path: '/challenges', query: { tags: tag } }"
            class="bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-slate-500 transition cursor-pointer"
          >
            #{{ tag }}
          </RouterLink>
        </div>

        <!-- Tombol Hint / No Hint -->
        <div class="mb-4">
          <IconButton v-if="challenge.hint" @click="showHintModal = true" :icon="LightBulbIcon" label="Tampilkan Hint" color="yellow" class="absolute top-0 right-0 mt-4 mr-4" />
          <div v-else class="text-sm text-gray-500 italic">
            Tidak ada hint untuk challenge ini.
          </div>
        </div>

        <!-- Modal -->
        <Teleport to="body">
          <transition name="fade-scale">
            <div
              v-if="showHintModal"
              @click.self="showHintModal = false"
              @keydown.esc="showHintModal = false"
              tabindex="0"
              class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            >
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl transition-all duration-300">
                <!-- Content -->
                <h3 class="text-xl font-semibold text-yellow-700 dark:text-yellow-100 mb-3">
                  💡 Hint
                </h3>
                <p class="text-sm text-yellow-800 dark:text-yellow-50 whitespace-pre-line" v-html="formatText(challenge.hint)"></p>
              </div>
            </div>
          </transition>
        </Teleport>

        <div v-if="challenge.url" class="mt-8 flex flex-wrap gap-3">
          <!-- Download/Open Button -->
            <IconButton 
              @click="handleDownload" 
              :icon="isFile(challenge.url) ? ArrowDownTrayIcon : ArrowTopRightOnSquareIcon" 
              :label="isFile(challenge.url) ? 'Download File' : 'Open Link'" 
              color="blue" 
              class="flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold shadow-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition duration-200"
            />

            <!-- Copy Link Button -->
            <IconButton 
              @click="handleCopyLink" 
              :icon="LinkIcon" 
              label="Copy Link" 
              color="blue" 
              class="flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-semibold shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 active:scale-[0.98] transition duration-200 dark:text-blue-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            />
        </div>
      </div>

      <div v-if="loading" class="mt-10">
        <div class="h-6 bg-gray-300 dark:bg-slate-700 w-32 rounded mb-4"></div>
        <ul class="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
          <li v-for="n in 2" :key="n" class="flex justify-between py-3 px-6 animate-pulse">
            <div class="h-4 w-32 bg-gray-300 dark:bg-slate-700 rounded"></div>
            <div class="h-4 w-24 bg-gray-300 dark:bg-slate-700 rounded"></div>
          </li>
        </ul>
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

        <div v-if="hasMore" class="mt-4 text-center">
          <button
            @click="loadMoreSolvers"
            :disabled="isLoadingMore"
            class="px-5 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 active:scale-[0.98]"
          >
            {{ isLoadingMore ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>

      <!-- No Solvers -->
      <div v-else-if="!loading && challenge" class="mt-10">
        <p class="text-gray-500 italic">Belum ada yang menyelesaikan challenge ini.</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import SubmitFlag from '../../components/SubmitFlag.vue';
import Breadcrumbs from "../../components/Breadcrumbs.vue"
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import downloadFileByUrl from "../../utils/downloadFile.ts"
import { useChallengeDetail, loadMoreChallengeSolvers } from '../../services/useChallengeDetail'
import IconButton from "../../components/IconButton.vue"
import { LightBulbIcon, ArrowDownTrayIcon, ArrowTopRightOnSquareIcon, LinkIcon } from "@heroicons/vue/24/solid";
import GlobalSwal from "../../utils/GlobalSwal.ts";
const Swal = GlobalSwal;

const route = useRoute();

const id = computed(() => route.params.id as string)
const initialLimit = 3
const loadMoreLimit = 6

const { data, isValidating, mutate, error } = useChallengeDetail(id.value, initialLimit)
const loading = computed(() => isValidating.value);

const challenge = computed(() => data.value?.challenge)
const solvers = ref<any[]>([])
const solved = computed(() => data.value?.solved ?? false)

const offset = ref(0)
const hasMore = ref(true)
const isLoadingMore = ref(false)
const showHintModal = ref(false)

watch(data, (val) => {
  if (val?.solvers) {
    solvers.value = val.solvers
    offset.value = val.solvers.length
    hasMore.value = val.solvers.length >= initialLimit
  }
}, { immediate: true })

const formatText = (text: string) => marked.parse(text || '')

const loadMoreSolvers = async () => {
  isLoadingMore.value = true
  try {
    const moreSolvers = await loadMoreChallengeSolvers(id.value, offset.value, loadMoreLimit)
    if (moreSolvers.length) {
      solvers.value.push(...moreSolvers)
      offset.value += moreSolvers.length
      if (moreSolvers.length < loadMoreLimit) hasMore.value = false
    } else {
      hasMore.value = false
    }
  } catch (err) {
    console.error("❌ Error loading more solvers:", err)
  } finally {
    isLoadingMore.value = false
  }
}

const badgeColor = (difficulty: number) => {
  switch (difficulty) {
    case 1: return 'bg-green-200 text-green-800';
    case 2: return 'bg-yellow-200 text-yellow-800';
    case 3: return 'bg-red-200 text-red-800';
    default: return 'bg-gray-300 text-gray-700';
  }
}

const difficultyLabel = (difficulty: number) => {
  if (!difficulty || difficulty < 1 || difficulty > 3) return 'Unknown'
  return ['Easy', 'Medium', 'Hard'][difficulty - 1]
}

const formattedDate = (raw: string) => {
  if (!raw) return 'Unknown date'
  const date = new Date(raw)
  return isNaN(date.getTime())
    ? 'Invalid date'
    : date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
}

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

const handleCopyLink = async () => {
  const url = challenge.value?.url;
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    await Swal.fire({
      icon: "success",
      title: "Link berhasil disalin!",
      text: "URL challenge sudah ada di clipboard.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    console.error("❌ Gagal menyalin link:", e);
    await Swal.fire({
      icon: "error",
      title: "Gagal menyalin",
      text: "Terjadi kesalahan saat menyalin link.",
    });
  }
};

// Function to check if the URL points to a file
const isFile = (url: string): boolean => {
  return /\.(pdf|zip|txt|png|jpg|jpeg|mp4|mp3|docx)$/i.test(url);
};

// enter and escape
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    showHintModal.value = false;
  }
}
onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})

</script>

<!-- Transition Styles -->
<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>