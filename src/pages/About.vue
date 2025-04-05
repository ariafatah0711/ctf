<template>
    <Navbar />
    <div class="h-16"></div>

    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 px-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-6 text-center">Tentang Aplikasi</h1>
        <p class="text-lg mb-4 leading-relaxed">
          Aplikasi ini dibuat untuk mengelola challenge dan kompetisi CTF (Capture The Flag). Dibangun menggunakan teknologi modern seperti Vue.js, Supabase, dan TailwindCSS untuk memberikan pengalaman pengguna yang cepat, aman, dan efisien.
        </p>
        <p class="text-lg mb-4 leading-relaxed">
          Fitur utama meliputi:
        </p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Manajemen user dan autentikasi menggunakan Supabase Auth</li>
          <li>CRUD challenge untuk role admin/maker</li>
          <li>Submit flag & leaderboard otomatis</li>
          <li>Halaman profil yang menampilkan challenge yang telah diselesaikan</li>
        </ul>
        <p class="text-lg leading-relaxed">
          Proyek ini bersifat open-source dan dikembangkan sebagai latihan serta kontribusi terhadap komunitas. Semua masukan dan kontribusi sangat dihargai!
        </p>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
</script>