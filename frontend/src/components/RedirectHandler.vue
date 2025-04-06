<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const hash = window.location.hash // Misalnya: #access_token=abc&refresh_token=xyz...
  
  if (hash.includes('access_token=')) {
    // Biar token tetap kebaca di halaman reset-password
    router.replace(`/reset-password${hash}`)
  } else {
    router.replace('/') // fallback kalau token gak ada
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-gray-600 text-lg">Mengalihkan ke halaman reset password...</p>
  </div>
</template>