<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-lg text-center space-y-4">
        <h2 class="text-2xl font-bold dark:text-white">Verifikasi Email</h2>
        <p class="text-gray-700 dark:text-gray-300">
          Kami telah mengirimkan link verifikasi ke email kamu. Klik link tersebut untuk mengaktifkan akunmu.
        </p>
        <router-link
          to="/login"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 transition"
        >
          Kembali ke Login
        </router-link>
      </div>
    </div>
</template>

<script setup lang="ts">
import config from '../config/env'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  if (!config.VERIV_EMAIL) {
    router.push('/login')
  }
})
</script>