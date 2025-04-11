<template>
    <div v-if="showResetForm" class="min-h-screen fixed w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pb-30">
      <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 class="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form @submit.prevent="handleReset">
          <input
            v-model="newPassword"
            type="password"
            placeholder="Password Baru"
            class="w-full p-3 rounded border border-gray-300 mb-4 dark:bg-gray-700 dark:border-gray-600 text-sm"
          />
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition"
          >
            {{ loading ? 'Mereset...' : 'Reset' }}
          </button>
        </form>
        <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">
            Kembali ke Login
          </router-link>
        </p>
      </div>
    </div>
  
    <div v-else class="py-12 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <div class="mb-8">
          <img 
            :src="config.IMG_HOMEPAGE"z  
            alt="CTF Platform Icon" 
            class="w-44 h-44 md:w-74 md:h-74 lg:w-94 lg:h-94 mx-auto max-w-full"
          />
        </div>
  
        <h1 class="text-3xl md:text-5xl font-extrabold mb-6">
          Selamat Datang di {{ config.APP_NAME }}!
        </h1>
        <p
          class="text-base md:text-lg mb-8 leading-relaxed"
          v-html="config.APP_DESCRIPTION"
        />
        <div class="flex flex-col md:flex-row justify-center gap-4">
          <router-link v-if="!auth.isAuthenticated"
            to="/register" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition text-center">
            Daftar Sekarang
          </router-link>
          <router-link v-if="auth.isAuthenticated"
            to="/challenges" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-center">
            Lihat Challenge
          </router-link>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
// 1. Import libraries
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Import store & config
import { useAuthStore } from '@/stores/auth'
import config from '@/config/env'

// 3. Import utils & services
import { swalError, swalSuccess, swalAlert } from '@/utils/swalAlert'
import { resetPassword } from '@/services/authService'

// 4. State & utilities
const router = useRouter()
const auth = useAuthStore()
const showResetForm = ref(false)
const newPassword = ref('')
const token = ref('')
const loading = ref(false)

// 5. Logic function
async function handleReset() {
  if (!newPassword.value || newPassword.value.length < 6) {
    swalAlert('Oops', 'Password minimal 6 karakter!')
    return
  }

  loading.value = true
  try {
    await resetPassword(token.value, newPassword.value)
    swalSuccess('Berhasil!', 'Password berhasil diubah.')
    router.push('/login')
  } catch (err: any) {
    swalError('Gagal', err.message || 'Terjadi kesalahan.')
  } finally {
    loading.value = false
  }
}

// 6. Lifecycle
onMounted(() => {
  const hash = window.location.hash
  const tokenMatch = hash.match(/access_token=([^&]+)/)
  if (tokenMatch) {
    token.value = tokenMatch[1]
    showResetForm.value = true
  }
})
</script>