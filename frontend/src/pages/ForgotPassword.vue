<!-- <template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 class="text-xl font-bold mb-4 text-center dark:text-white">Forgot Password</h2>
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <div>
            <label for="email" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-4 py-2 border rounded focus:outline-none dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="loading || cooldown > 0"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            <span v-if="loading">Mengirim...</span>
            <span v-else-if="cooldown > 0">Tunggu {{ cooldown }} detik</span>
            <span v-else>Kirim Link Reset</span>
          </button>
          <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">Kembali ke Login</router-link>
          </p>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { forgotPassword } from '../services/authService';
import GlobalSwal from '../utills/GlobalSwal';

const Swal = GlobalSwal;

const email = ref('');
const loading = ref(false);
const cooldown = ref(0);
let timer: NodeJS.Timeout | null = null;

const COOLDOWN_DURATION = 60; // detik
const COOLDOWN_KEY = 'forgot_password_last_sent';

onMounted(() => {
  const lastSent = localStorage.getItem(COOLDOWN_KEY);
  if (lastSent) {
    const secondsPassed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
    const remaining = COOLDOWN_DURATION - secondsPassed;
    if (remaining > 0) {
      startCooldown(remaining);
    }
  }
});

async function handleForgotPassword() {
  if (cooldown.value > 0) return;

  loading.value = true;
  try {
    await forgotPassword(email.value);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Link reset password telah dikirim ke email kamu.',
    });
    email.value = '';
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString()); // simpan timestamp
    startCooldown(COOLDOWN_DURATION);
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
  } finally {
    loading.value = false;
  }
}

function startCooldown(seconds: number) {
  cooldown.value = seconds;
  timer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0 && timer) {
      clearInterval(timer);
      timer = null;
      localStorage.removeItem(COOLDOWN_KEY); // hapus data
    }
  }, 1000);
}
</script> -->

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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