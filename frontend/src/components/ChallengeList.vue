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
    <div v-if="challenges.length === 0" class="text-center text-gray-500 dark:text-gray-400 mt-12">
      Challenge tidak ditemukan.
    </div>

    <!-- Challenge Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>

    <!-- Pagination -->
    <nav v-if="challenges.length > 0" class="flex justify-center mt-8" aria-label="Page navigation">
      <ul class="inline-flex items-center space-x-2">
        <!-- Prev -->
        <li>
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="px-3 py-2 rounded-xl text-sm font-medium bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 
                   text-gray-800 dark:text-white disabled:opacity-50"
          >
            Prev
          </button>
        </li>

        <!-- Page Numbers -->
        <li v-for="n in totalPages" :key="n">
          <button
            @click="setPage(n)"
            :class="[
              'px-3 py-2 rounded-xl text-sm font-medium',
              page === n
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
            ]"
          >
            {{ n }}
          </button>
        </li>

        <!-- Next -->
        <li>
          <button
            @click="nextPage"
            :disabled="page === totalPages"
            class="px-3 py-2 rounded-xl text-sm font-medium bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 
                   text-gray-800 dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ChallengeCard from './ChallengeCard.vue';
  import { useAuthStore } from '../stores/auth';
  import config from '../config';

  const route = useRoute();
  const router = useRouter();

  const auth = useAuthStore();

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
    try {
      const params = new URLSearchParams();
      params.set("page", page.value.toString());
      if (selectedDifficulty.value) params.set("difficulty", selectedDifficulty.value);
      if (selectedTag.value) params.set("tags", selectedTag.value);

      const res = await fetch(`${config.BASE_URL}/api/challenges?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
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