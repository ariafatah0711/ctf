<template>
  <div class="min-h-screen fixed w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <AuthForm
        title="Forgot Password"
        :fields="[{ name: 'email', label: 'Email', type: 'email' }]"
        :model="form"
        :loading="loading"
        loadingText="Mengirim..."
        :submitText="cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Kirim Link Reset'"
        :error="error"
        :success="success"
        :onSubmit="handleForgotPassword"
        color="blue"
      >
        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">
              Kembali ke Login
            </router-link>
          </p>
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { forgotPassword } from '../services/authService'
import GlobalSwal from '../utills/GlobalSwal'
import AuthForm from '../components/AuthForm.vue'

const form = reactive({ email: '' })
const loading = ref(false)
const error = ref('')
const success = ref('')
const cooldown = ref(0)
let timer: NodeJS.Timeout | null = null

const COOLDOWN_DURATION = 60
const COOLDOWN_KEY = 'forgot_password_last_sent'

onMounted(() => {
  const lastSent = localStorage.getItem(COOLDOWN_KEY)
  if (lastSent) {
    const secondsPassed = Math.floor((Date.now() - parseInt(lastSent)) / 1000)
    const remaining = COOLDOWN_DURATION - secondsPassed
    if (remaining > 0) startCooldown(remaining)
  }
})

async function handleForgotPassword() {
  if (cooldown.value > 0) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await forgotPassword(form.email)
    success.value = 'Link reset password telah dikirim ke email kamu.'
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString())
    form.email = ''
    startCooldown(COOLDOWN_DURATION)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function startCooldown(seconds: number) {
  cooldown.value = seconds
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer)
      timer = null
      localStorage.removeItem(COOLDOWN_KEY)
    }
  }, 1000)
}
</script>