<template>
    <button
      @click="toggleDarkMode"
      class="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      aria-label="Toggle Dark Mode"
    >
      <component :is="isDark ? Sun : Moon" class="w-5 h-5" />
    </button>
  </template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Moon, Sun } from 'lucide-vue-next'
  import config from '../config/env.ts'
  
  const isDark = ref(false)
  
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    const theme = isDark.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme_', theme)
  }
  
  onMounted(() => {
    localStorage.removeItem('theme') // hapus versi lama

    const saved = localStorage.getItem('theme_') || config.DEFAULT_THEME || 'light'
    isDark.value = saved === 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  })
</script>