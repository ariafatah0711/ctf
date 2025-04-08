<template>
  <div>
    <!-- Filter Section -->
    <div class="flex flex-wrap justify-start mb-6 gap-4">
      <!-- Filter Difficulty -->
      <div class="w-full sm:w-64">
        <label for="difficulty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Filter Difficulty
        </label>
        <select
          id="difficulty"
          v-model="selectedDifficulty"
          @change="onFilterChange"
          class="w-full p-2.5 rounded-xl text-sm bg-white border border-gray-300 
                 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white 
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
      </div>

      <!-- Filter Tag -->
      <div class="w-full sm:w-64">
        <label for="tags" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Filter Tag
        </label>
        <select
          id="tags"
          v-model="selectedTag"
          @change="onFilterChange"
          class="w-full p-2.5 rounded-xl text-sm bg-white border border-gray-300 
                 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white 
                 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Tags</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
    </div>

    <!-- No Challenges -->
    <div v-if="challenges.length === 0 && !loading" class="text-center text-gray-500 dark:text-gray-400 mt-12">
      Challenge tidak ditemukan.
    </div>

    <!-- Skeleton Loader saat loading -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      <ChallengeCardSkeleton v-for="n in 9" :key="n" />
    </div>

    <!-- Challenge Cards -->
    <div  v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>

    <Pagination
      :current-page="page"
      :total-pages="totalPages"
      @update:page="setPage"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ChallengeCard from './ChallengeCard.vue';
  import ChallengeCardSkeleton from './skelaton/ChallengeCardSkeleton.vue';
  import Pagination from "./Pagination.vue"
  import { useAuthStore } from '../stores/auth';
  import config from '../config';

  const route = useRoute();
  const router = useRouter();

  const auth = useAuthStore();
  const loading = ref(false);

  interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    tags: string[];
    created_at: string;
    solved?: boolean;
  }

  const challenges = ref<Challenge[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const selectedDifficulty = ref('');
  const selectedTag = ref('');
  const availableTags = ref<string[]>([]);

  const fetchChallenges = async () => {
    loading.value = true
    try {
      const params = new URLSearchParams();
      params.set("page", page.value.toString());
      if (selectedDifficulty.value) params.set("difficulty", selectedDifficulty.value);
      if (selectedTag.value) params.set("tags", selectedTag.value);

      const res = await fetch(`${config.BASE_URL}/api/challenges?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal ambil challenge");
      const json = await res.json();

      challenges.value = json.data;
      totalPages.value = json.totalPages;
      availableTags.value = json.tags || [];
      challenges.value = json.data;
      totalPages.value = json.totalPages;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const onFilterChange = () => {
    page.value = 1; // reset ke page 1 saat filter berubah
      router.replace({
        query: {
          ...route.query,
          page: '1',
          difficulty: selectedDifficulty.value || undefined,
          tags: selectedTag.value || undefined, // ✅ tambahin
        },
      });
    fetchChallenges();
  };

  // onMounted(fetchChallenges);
  onMounted(() => {
    const queryPage = parseInt(route.query.page as string);
    const queryDifficulty = route.query.difficulty as string;
    const queryTag = route.query.tags as string;

    if (!isNaN(queryPage) && queryPage > 0) page.value = queryPage;
    if (queryDifficulty) selectedDifficulty.value = queryDifficulty;
    if (queryTag) selectedTag.value = queryTag;
    fetchChallenges();
  });

  // watch(page, fetchChallenges);
  watch(page, (newPage) => {
    router.replace({ query: { ...route.query, page: newPage.toString() } });
    fetchChallenges(); // fetch data tiap kali page berubah
  });

  const nextPage = () => {
    if (page.value < totalPages.value) page.value++;
  };

  const prevPage = () => {
    if (page.value > 1) page.value--;
  };

  const setPage = (n: number) => {
    if (n !== page.value) {
      page.value = n;
    }
  };
</script>