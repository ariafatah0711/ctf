<!-- <template>
    <div v-if="challenges.length === 0" class="text-gray-500">Belum ada tantangan.</div>
    
    <div v-for="challenge in challenges" :key="challenge.id" class="mb-4 p-4 border rounded">
      <h2 class="font-bold text-lg">{{ challenge.title }}</h2>
      <p>{{ challenge.description }}</p>
      <span class="text-sm text-gray-500">Difficulty: {{ challenge.difficulty }}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const challenges = ref([]);

onMounted(async () => {
try {
    const res = await fetch('http://localhost:3000/api/challenges', {
    headers: {
        Authorization: `Bearer ${auth.token}`,
    },
    });

    if (!res.ok) throw new Error('Gagal ambil challenge');
    challenges.value = await res.json();
} catch (err) {
    console.error(err);
}
});
</script> -->

<!-- <template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <ChallengeCard
      v-for="challenge in challenges"
      :key="challenge.id"
      :challenge="challenge"
    />
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ChallengeCard from './ChallengeCard.vue';
  import { useAuthStore } from '../stores/auth';
  import config from "../config"
  
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

  // const challenges = ref([]);
  
  onMounted(async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
  
      if (!res.ok) throw new Error('Gagal ambil challenge');
      challenges.value = await res.json();
      console.log(challenges.value)
    } catch (err) {
      console.error(err);
    }
  });
</script> -->

<template>
  <div>
    <!-- Grid Challenge -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>

    <!-- Pagination -->
    <nav aria-label="Page navigation example" class="flex justify-center mt-6">
      <ul class="list-style-none flex">
        <li>
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="relative block rounded px-3 py-1.5 text-sm transition duration-300 dark:text-neutral-400 text-surface/50 disabled:pointer-events-none"
          >
            Previous
          </button>
        </li>

        <li v-for="n in totalPages" :key="n">
          <button
            @click="setPage(n)"
            :class="[
              'relative block rounded px-3 py-1.5 text-sm transition duration-300',
              page === n
                ? 'bg-primary-100 text-primary-700 font-medium dark:bg-slate-900 dark:text-primary-500'
                : 'bg-transparent text-surface hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700'
            ]"
          >
            {{ n }}
          </button>
        </li>

        <li>
          <button
            @click="nextPage"
            :disabled="page === totalPages"
            class="relative block rounded px-3 py-1.5 text-sm transition duration-300 dark:text-neutral-400 text-surface/50 disabled:pointer-events-none"
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