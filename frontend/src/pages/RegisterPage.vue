<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div class="hidden md:block">
        <img src="../assets/2.png" alt="Register Illustration" class="w-full h-auto"/>
      </div>
      <AuthForm
        title="Register"
        :fields="[
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' }
        ]"
        :model="form"
        :loading="loading"
        loadingText="Registering..."
        submitText="Register"
        :error="error"
        :success="success"
        :onSubmit="handleRegister"
        color="green"
      >
        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">Login</router-link>
          </p>
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService'
import AuthForm from "../components/AuthForm.vue"

const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await register(form)
    success.value = 'Registrasi berhasil. Silakan cek email kamu untuk verifikasi.'
    form.username = ''
    form.email = ''
    form.password = ''
    router.push('/Verify')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
