<template>
  <div class="py-12 px-6">
    <div class="max-w-5xl mx-auto text-center">

      <!-- Kalau ada access_token di hash, tampilkan form reset password -->
      <div v-if="showResetForm">
        <h2 class="text-3xl font-bold mb-6">Reset Password</h2>
        <form @submit.prevent="handleReset">
          <input
            v-model="newPassword" type="password" placeholder="Password baru"
            class="w-full max-w-md p-3 rounded border border-gray-300 mb-4 dark:bg-gray-800 dark:border-gray-600"/>
          <br />
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition"
          >
            Reset
          </button>
        </form>
      </div>

      <!-- Kalau tidak ada token, tampilkan welcome screen -->
      <div v-else>
        <div class="mb-8">
          <img 
            src="../assets/icon.png" 
            alt="CTF Platform Icon" 
            class="w-54 h-54 md:w-74 md:h-74 lg:w-94 lg:h-94 mx-auto max-w-full"
          />
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold mb-6">
          Selamat Datang di {{ app_name }}!
        </h1>
        <p class="text-base md:text-lg mb-8 leading-relaxed">
          Merupakan Platform latihan dan kompetisi CTF (Capture The Flag) berbasis web. Tantang dirimu, pecahkan soal, dan naik ke puncak leaderboard!
        </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth';
import Navbar from '../components/Navbar.vue'
import packageInfo from "../../package.json"
import config from '../config'
import Swal from 'sweetalert2'

const app_name = packageInfo.name
const showResetForm = ref(false)
const newPassword = ref("")
const token = ref("")
const auth = useAuthStore();
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  const hash = window.location.hash
  console.log(hash)
  const tokenMatch = hash.match(/access_token=([^&]+)/)
  if (tokenMatch) {
    token.value = tokenMatch[1]
    showResetForm.value = true
  }
})

async function handleReset() {
  if (!newPassword.value || newPassword.value.length < 6) {
    Swal.fire({ icon: 'warning', title: 'Oops', text: 'Password minimal 6 karakter!' })
    return
  }

  loading.value = true
  try {
    console.log(token.value)
    console.log(newPassword.value)
    const res = await fetch(`${config.BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value,
        newPassword: newPassword.value,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Password berhasil diubah.' })
    router.push('/login')
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err.message || 'Terjadi kesalahan.' })
  } finally {
    loading.value = false
  }
}
</script>