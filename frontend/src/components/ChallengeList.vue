<template>
  <div>
    <div class="flex justify-start mb-4 gap-4">
      <!-- Filter Difficulty -->
      <div class="max-w-xs w-full">
        <label for="difficulty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Filter Difficulty
        </label>
        <select
          id="difficulty"
          v-model="selectedDifficulty"
          @change="onFilterChange"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Difficulties</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
      </div>

      <!-- Filter Tags -->
      <div class="max-w-xs w-full">
        <label for="tags" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Filter Tag
        </label>
        <select
          id="tags"
          v-model="selectedTag"
          @change="onFilterChange"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Tags</option>
          <option
            v-for="tag in availableTags"
            :key="tag"
            :value="tag"
          >
            {{ tag }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="challenges.length === 0" class="text-center text-gray-500 mt-8">Challenge tidak ditemukan.</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>

    <!-- Pagination -->
    <nav v-if="challenges.length > 0" aria-label="Page navigation example" class="flex justify-center mt-6">
      <ul class="flex gap-2">
        <li>
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
        </li>

        <li v-for="n in totalPages" :key="n">
          <button
            @click="setPage(n)"
            :class="[ 
              'px-3 py-1.5 rounded',
              page === n
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-100 hover:bg-gray-200'
            ]"
          >
            {{ n }}
          </button>
        </li>

        <li>
          <button
            @click="nextPage"
            :disabled="page === totalPages"
            class="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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