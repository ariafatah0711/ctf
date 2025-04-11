<template>
  <div class="text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 px-4 py-8 sm:px-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
        Tentang Aplikasi
      </h1>
      <div v-html="config.ABOUT_PAGE"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import config from "../config/env"
</script>