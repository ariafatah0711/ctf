<!-- <template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 class="text-xl font-bold mb-4 text-center dark:text-white">Setup Admin</h2>

      <div v-if="setupCompleted" class="text-green-500 text-center text-sm">
        Setup sudah dilakukan! Anda tidak dapat mengatur ulang admin.
        <router-link to="/login" class="inline-block text-green-500 hover:underline dark:text-green-500">Kembali ke Login</router-link>
      </div>

      <form v-else @submit.prevent="handleSetup" class="space-y-4">
        <div>
          <label for="username" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            disabled
            class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label for="email" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="password" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Setup</span>
        </button>

        <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-center text-sm">Setup berhasil! Redirect ke login...</p>
      </form>
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
</script> -->

<template>
  <div class="min-h-screen w-full fixed flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pb-30">
    <div class="max-w-md w-full">
      <AuthForm
        v-if="!setupCompleted"
        title="Setup Admin"
        :fields="fields"
        :model="form"
        :loading="loading"
        loadingText="Memproses..."
        submitText="Setup"
        :error="error"
        :success="success ? 'Setup berhasil! Redirect ke login...' : ''"
        :onSubmit="handleSetup"
        color="blue"
      />
      <div
        v-else
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center text-sm text-green-500"
      >
        Setup sudah dilakukan! Anda tidak dapat mengatur ulang admin.
        <router-link to="/login" class="inline-block text-green-500 hover:underline dark:text-green-500">
          Kembali ke Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm from '../components/AuthForm.vue'
import config from '../config'

const form = reactive({
  username: 'admin',
  email: '',
  password: '',
})

const fields = [
  { name: 'username', label: 'Username', type: 'text', disabled: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
]

const loading = ref(false)
const error = ref('')
const success = ref(false)
const setupCompleted = ref(false)
const router = useRouter()

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
        email: form.email,
        password: form.password,
      }),
    })

    if (!res.ok) {
      const errorRes = await res.json()
      throw new Error(errorRes.message || 'Setup gagal')
    }

    success.value = true
    setTimeout(() => router.push('/verify'), 2000)
  } catch (err: any) {
    error.value = err.message || 'Gagal melakukan setup'
  } finally {
    loading.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSetup()
  }
}
onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})
</script>