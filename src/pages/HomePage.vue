<template>
  <Navbar />

  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 px-6">
    <div class="max-w-5xl mx-auto text-center">
      <h1 class="text-5xl font-extrabold mb-6">Selamat Datang di CTF Platform!</h1>
      <p class="text-lg mb-8 leading-relaxed">
        Platform latihan dan kompetisi CTF (Capture The Flag) berbasis web. Tantang dirimu, pecahkan soal, dan naik ke puncak leaderboard!
      </p>
      <div class="flex justify-center gap-4">
        <router-link
          to="/register"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition"
        >
          Daftar Sekarang
        </router-link>
        <router-link
          to="/challenges"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Lihat Challenge
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
</script>