<template>
  <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col min-h-screen w-full">
    <Navbar />
    <div class="w-full pt-16">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'  
</script>