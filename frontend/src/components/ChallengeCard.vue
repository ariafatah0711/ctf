<template>
  <RouterLink :to="`/challenges/${slugify(challenge.id)}`" class="block group h-full">
    <div
      :class="[
        'rounded-2xl p-5 h-full shadow hover:shadow-lg transition duration-200 flex flex-col justify-between border',
        challenge.solved
          ? 'bg-green-100 dark:bg-green-700 border-green-300 dark:border-green-600'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
      ]"
    >
      <!-- Top Section -->
      <div>
        <!-- Badge Difficulty -->
        <div class="flex justify-between items-start mb-2">
          <h5 class="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 truncate transition">
            {{ challenge.title }}
          </h5>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-semibold"
            :class="badgeColor(challenge.difficulty)"
          >
            {{ difficultyLabel(challenge.difficulty) }}
          </span>
        </div>

        <!-- Description -->
        <p
          v-if="challenge.description"
          class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3"
        >
          {{ challenge.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 text-xs mb-4">
          <span
            v-for="tag in challenge.tags"
            :key="tag"
            class="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white px-2 py-0.5 rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{{ formattedDate(challenge.created_at) }}</span>
        <button
          type="button"
          class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Lihat Detail →
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