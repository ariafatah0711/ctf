<template>
  <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col min-h-screen">
    <Navbar />
    <div class="h-16"></div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'  
</script>