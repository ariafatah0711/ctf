<template>
  <RouterLink :to="`/challenges/${slugify(challenge.id)}`" class="block group">
    <div :class="['rounded-lg p-6 shadow-md transition duration-200 ease-in-out h-full flex flex-col justify-between',
      challenge.solved ? 'bg-green-100 dark:bg-green-700' : 'bg-white dark:bg-gray-800'
    ]">

      <div>
        <!-- Title -->
        <h5 class="mb-2 text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 transition">
          {{ challenge.title }}
        </h5>

        <!-- Description (optional) -->
        <p v-if="challenge.description" class="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {{ challenge.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 text-xs mb-4">
          <span
            v-for="tag in challenge.tags"
            :key="tag"
            class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-2 py-0.5 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- Date & Difficulty -->
        <div class="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400">
          <span>{{ formattedDate(challenge.created_at) }}</span>
          <span :class="badgeColor(challenge.difficulty)">
            {{ difficultyLabel(challenge.difficulty) }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-6">
        <button
          type="button"
          class="inline-block rounded bg-blue-600 px-4 py-2 text-xs font-medium uppercase text-white shadow hover:bg-blue-700 transition"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  </RouterLink>
</template>
  
<script setup lang="ts">
  import { RouterLink } from 'vue-router';

  defineProps<{
  challenge: {
    id: string;
    title: string;
    description?: string;
    difficulty: number;
    tags: string[];
    created_at: string;
    solved?: boolean;
  };
}>();
  
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
    return ['Easy', 'Medium', 'Hard'][difficulty - 1] || 'Unknown';
  };
  
  const formattedDate = (raw: string) => {
    const date = new Date(raw);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, '');    // trim hyphens from start/end
  };
</script>