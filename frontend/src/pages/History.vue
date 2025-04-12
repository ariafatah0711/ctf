<template>
    <div class="w-full flex justify-center">
      <div class="p-4 w-full max-w-screen-xl">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4">
            <h1 class="flex-1 my-4 text-2xl font-bold text-blue-600 dark:text-blue-400 sm:text-left">
                <RouterLink
                to="/history"
                class="hover:underline"
                >
                {{ title }}
                </RouterLink>
            </h1>
        </div>

        <!-- Loading / Error -->
        <SkeletonHistory v-if="isLoading" />
        <div v-else-if="error" class="text-red-500 text-center">Gagal memuat riwayat: {{ error }}</div>
  
        <!-- Log Section -->
        <div
          v-else
          class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 font-mono p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto max-h-[70vh] min-h-[70vh] whitespace-pre-wrap transition-all"
        >
          <div v-if="history.length">
            <TransitionGroup name="fade" tag="div">
              <div
                v-for="item in history"
                :key="`${item.challenge_id}-${item.completed_at}`"
                class="border-b border-gray-300 dark:border-slate-600 py-2 transition-opacity"
              >
                <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-x-1">
                  <div class="flex gap-x-1 flex-wrap">
                    <span class="text-blue-600 dark:text-blue-400">
                      {{ new Date(item.completed_at).toLocaleString() }}
                    </span>
                    <span>-</span>
                    <RouterLink
                      :to="`/profile/${item.username}`"
                      class="font-bold text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {{ item.username }}
                    </RouterLink>
                  </div>
                  
                  <div class="flex gap-x-1 flex-wrap">
                    <span>menyelesaikan</span>
                    <RouterLink
                      :to="`/challenges/${item.challenge_id}`"
                      class="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 hover:underline break-words"
                    >
                      {{ item.title }}
                    </RouterLink>
                  </div>
                </div>
              </div>
            </TransitionGroup>
            
          <!-- Tombol Load More -->
          <div v-if="hasMore" class="pt-4 flex justify-center">
            <button
              @click="loadNextPage"
              :disabled="isLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {{ isLoading ? 'Memuat...' : 'Tampilkan Lebih Banyak' }}
            </button>
          </div>
          </div>
          <div v-else class="italic text-gray-500 dark:text-gray-400">Belum ada riwayat tantangan.</div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useChallengeHistory } from '../services/useHistoryData'
import SkeletonHistory from '@/components/skelaton/SkeletonHistory.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const username = computed(() => route.query.user)

const {
  data: history,
  hasMore,
  loadNextPage,
  isLoading,
  error,
} = useChallengeHistory()

const title = computed(() => username.value
  ? `🏆 Riwayat ${username.value}`
  : '🏆 Riwayat')
</script>
  
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile First (default) */
.font-mono {
  font-size: 0.75rem; /* text-sm */
  padding-top: 0.5rem !important;
  padding: 1rem;
}

/* Tablet */
@media (max-width: 640px) {
  .font-mono span,
  .font-mono a {
    word-break: break-word;
  }
}

/* Laptop */
@media (min-width: 1024px) {
  .font-mono {
    font-size: 1rem; /* text-lg */
    padding-top: 0.5rem !important;
    padding: 1.5rem;
  }
}
</style>