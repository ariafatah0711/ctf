<!-- <template>
  <div class="text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Tentang Aplikasi
      </h1>

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
          class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition shadow"
        >
          Lihat di GitHub
        </a>
        <a
          href="https://ariaf.my.id/blog/ctf_web"
          target="_blank"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 shadow"
        >
          Kunjungi Website
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script> -->

<template>
  <div class="text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 px-4 py-8 sm:px-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">
        Tentang Aplikasi
      </h1>

      <p class="text-lg mb-4 leading-relaxed">
        Aplikasi ini dirancang untuk mempermudah pengelolaan challenge dan kompetisi CTF (Capture The Flag) dengan teknologi modern seperti <strong>Vue.js</strong>, <strong>Supabase</strong>, dan <strong>TailwindCSS</strong>. Fokus kami adalah memberikan pengalaman pengguna yang <em>cepat</em>, <em>intuitif</em>, dan <em>aman</em>.
      </p>

      <p class="text-lg mb-4 leading-relaxed">Fitur unggulan meliputi:</p>
      <ul class="list-disc list-inside mb-6 space-y-2 text-base">
        <li>Manajemen user dan autentikasi menggunakan Supabase Auth</li>
        <li>CRUD challenge untuk admin dan maker (aktif/nonaktifkan challenge)</li>
        <li>Upload challenge untuk publik yang akan ditinjau dan disetujui admin</li>
        <li>Submit flag dan leaderboard otomatis & real-time</li>
        <li>Halaman profil dengan daftar challenge yang telah diselesaikan</li>
        <li>Histori submit flag (by user maupun global)</li>
        <li>Filter challenge berdasarkan kategori</li>
        <li>Mode gelap dan terang (dark/light mode)</li>
        <li>Tampilan dashboard terpusat untuk monitoring & manajemen</li>
        <li>Website ringan dan smooth untuk semua perangkat</li>
      </ul>

      <p class="text-lg leading-relaxed mb-8">
        Proyek ini bersifat open-source dan dikembangkan sebagai bentuk kontribusi ke komunitas. Kontribusi dan feedback dari siapa pun sangat kami apresiasi!
      </p>

      <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        <a
          href="https://github.com/ariafatah0711/ctf"
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition shadow text-center"
        >
          Lihat di GitHub
        </a>
        <a
          href="https://ariaf.my.id/blog/ctf_web"
          target="_blank"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 shadow text-center"
        >
          Kunjungi Website
        </a>
        <RouterLink
          to="/challenges/upload"
          class="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition shadow text-center"
        >
          Upload Challenge Kamu
        </RouterLink>
        <a
          href="https://s.id/dev-universe"
          target="_blank"
          class="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition shadow text-center"
        >
          Gabung Komunitas
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>