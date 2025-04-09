<template>
    <div class="w-full flex justify-center">
      <div class="p-4 w-full max-w-screen-xl">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
        <ProfileSkeleton v-if="loading && currentPage === 1" />
        <div v-else-if="error" class="text-red-500 text-center">Gagal memuat riwayat: {{ error }}</div>
  
        <!-- Log Section -->
        <div
          v-else
          class="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 font-mono p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto max-h-[70vh] whitespace-pre-wrap transition-all"
        >
          <div v-if="history.length">
            <TransitionGroup name="fade" tag="div">
              <div
                v-for="item in history"
                :key="`${item.challenge_id}-${item.completed_at}`"
                class="border-b border-gray-300 dark:border-slate-600 py-2 transition-opacity"
              >
                <span class="text-blue-600 dark:text-blue-400">{{ new Date(item.completed_at).toLocaleString() }}</span>
                &nbsp;-&nbsp;
                <RouterLink :to="`/profile/${item.username}`" class="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    {{ item.username }}
                </RouterLink>
                <span> menyelesaikan </span>
                <RouterLink :to="`/challenges/${item.challenge_id}`" class="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 hover:underline">
                  {{ item.title }}
                </RouterLink>
              </div>
            </TransitionGroup>
  
            <!-- Tombol Load More -->
            <div v-if="hasMore" class="pt-4 flex justify-center">
              <button
                @click="loadMore"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
              >
                Tampilkan Lebih Banyak
              </button>
            </div>
          </div>
          <div v-else class="italic text-gray-500 dark:text-gray-400">Belum ada riwayat tantangan.</div>
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ProfileSkeleton from '../components/skelaton/ProfileSkeleton.vue';
  import config from '../config';
  
  const route = useRoute();
  const userIdFromQuery = computed(() => route.query.id);
  
  const loading = ref(true);
  const error = ref<string | null>(null);
  const history = ref<any[]>([]);
  const currentPage = ref(1);
  const limit = 15;
  const hasMore = ref(true);

  const usernameFromQuery = computed(() => route.query.user);
  const title = computed(() => {
  return usernameFromQuery.value
      ? `🏆 Riwayat Tantangan ${usernameFromQuery.value}`
      : '🏆 Riwayat Tantangan';
  });

  const fetchHistory = async (append = false) => {
    try {
      loading.value = true;
      let url = `${config.BASE_URL}/api/challenges/history?page=${currentPage.value}&limit=${limit}`;
      if (userIdFromQuery.value) {
        url += `&userId=${userIdFromQuery.value}`;
      }
  
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memuat riwayat tantangan');
  
      const items = data.data || data;
  
      if (append) {
        history.value = [...history.value, ...items];
      } else {
        history.value = items;
      }
  
      hasMore.value = items.length === limit;
    } catch (err: any) {
      error.value = err.message || 'Terjadi kesalahan saat mengambil riwayat';
    } finally {
      loading.value = false;
    }
  };

  watch(() => route.fullPath, () => {
        fetchHistory();
  });
  
  onMounted(() => {
    fetchHistory();
  });
  
  const loadMore = () => {
    currentPage.value++;
    fetchHistory(true);
  };
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
</style>