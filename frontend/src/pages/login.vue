<template>
    <div class="min-h-screen fixed w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pb-30">
      <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="hidden md:block">
          <img :src="config.IMG_LOGINPAGE" alt="Login Illustration" class="w-full h-auto" />
        </div>
        <AuthForm
          title="Login"
          :fields="[
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' }
          ]"
          :model="form"
          :loading="loading"
          loadingText="Logging in..."
          submitText="Login"
          :error="error"
          :onSubmit="handleLogin"
        >
          <template #extra>
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <input type="checkbox" v-model="rememberMe" class="form-checkbox text-blue-600" />
                Remember me
              </label>
              <router-link to="/forgot-password" class="text-blue-600 hover:underline dark:text-blue-400">Forgot password?</router-link>
            </div>
          </template>
          <template #footer>
            <p class="text-center text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?
              <router-link to="/register" class="text-blue-600 hover:underline dark:text-blue-400">Register</router-link>
            </p>
          </template>
        </AuthForm>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { encryptAuthData, decryptAuthData } from '@/utils/crypto';
import AuthForm from '@/components/AuthForm.vue';
import config from '@/config/env';

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');
const rememberMe = ref(false);
const router = useRouter();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') handleLogin();
};

async function handleLogin() {
  loading.value = true;
  error.value = '';

  try {
    const { session, user } = await login(form);
    const auth = useAuthStore();

    auth.login(session, user);
    await auth.checkAuth();

    if (rememberMe.value) {
      const encrypted = encryptAuthData(form.email, form.password);
      localStorage.setItem('auth_data', encrypted);
    } else {
      localStorage.removeItem('auth_data');
    }

    router.push('/challenges');
  } catch (err: any) {
    error.value = err.message || 'Login gagal, silakan coba lagi.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const encrypted = localStorage.getItem('auth_data');
  if (encrypted) {
    const data = decryptAuthData(encrypted);
    if (data) {
      form.email = data.email;
      form.password = data.password;
      rememberMe.value = true;
    }
  }

  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>