<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-center">Tentang Aplikasi</h1>

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

      <p class="text-lg leading-relaxed mb-6">
        Proyek ini bersifat open-source dan dikembangkan sebagai latihan serta kontribusi terhadap komunitas. Semua masukan dan kontribusi sangat dihargai!
      </p>

      <div class="flex flex-col md:flex-row justify-center gap-4">
        <a
          href="https://github.com/ariafatah0711/ctf"
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded transition"
        >
          Lihat di GitHub
        </a>
        <a
          href="https://ariaf.my.id"
          target="_blank"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Kunjungi Website
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
</script>
