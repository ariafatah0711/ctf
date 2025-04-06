<template>
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="mx-auto block w-full max-w-lg px-4 py-6 rounded-lg bg-white shadow-xl dark:bg-surface-dark">
        <h1 class="text-2xl font-bold mb-4 text-center">Setup Admin</h1>
    
        <div v-if="setupCompleted">
          <p class="text-green-500 text-center">Setup sudah dilakukan! Anda tidak dapat mengatur ulang admin.</p>
        </div>
    
        <div v-else>
            <form @submit.prevent="handleSetup" class="w-full mx-auto">
                <!-- Username input -->
                <div class="relative mb-6">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input
                    type="text"
                    id="username"
                    v-model="username"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Username"
                    disabled
                    />
                </div>

                <!-- Email input -->
                <div class="relative mb-6">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                    type="email"
                    id="email"
                    v-model="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                    required
                    />
                </div>

                <!-- Password input -->
                <div class="relative mb-6">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                    type="password"
                    id="password"
                    v-model="password"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Password"
                    required
                    />
                </div>

                <button
                    type="submit"
                    class="inline-block w-full rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 focus:bg-primary-accent-300 focus:outline-none"
                    :disabled="loading"
                >
                    {{ loading ? 'Memproses...' : 'Setup' }}
                </button>

                <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
                <p v-if="success" class="text-green-500 text-center mt-2">Setup berhasil! Redirect ke login...</p>
            </form>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import config from "../config"
  
  const username = ref('admin')
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  const setupCompleted = ref(false)
  const router = useRouter()
  
  // Cek apakah setup sudah dilakukan ketika komponen di-mount
  onMounted(async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/setup`)
      if (res.ok) {
        const data = await res.json()
        if (data.message === "Setup sudah dilakukan.") {
          setupCompleted.value = true
        }
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat memeriksa status setup.", err)
    }
  })
  
  const handleSetup = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(`${config.BASE_URL}/api/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
  
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Setup gagal')
      }
  
      success.value = true
      setTimeout(() => router.push('/verify'), 2000)
    } catch (err: any) {
      error.value = err.message || 'Gagal melakukan setup'
    } finally {
      loading.value = false
    }
  }
</script>
  
<style scoped>  
  .bg-primary {
    background-color: #4f46e5;
  }
  .text-primary {
    color: #4f46e5;
  }
  .text-neutral-500 {
    color: #6b7280;
  }
  .dark .text-primary {
    color: #fff;
  }
</style>