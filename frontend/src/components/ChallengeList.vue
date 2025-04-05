<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation example" class="flex justify-center mt-6">
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

  const fetchChallenges = async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges?page=${page.value}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal ambil challenge');
      const json = await res.json();
      challenges.value = json.data;
      totalPages.value = json.totalPages;
    } catch (err) {
      console.error(err);
    }
  };

  // onMounted(fetchChallenges);
  onMounted(() => {
    const queryPage = parseInt(route.query.page as string);
    if (!isNaN(queryPage) && queryPage > 0) {
      page.value = queryPage;
    }
    fetchChallenges()
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