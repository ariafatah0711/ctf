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

<template>
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
  const challenges = ref([]);
  
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
</script>