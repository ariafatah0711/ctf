<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Kolom Gambar -->
      <div class="hidden md:block">
        <img
          src="../../assets/2.png"
          alt="Register Illustration"
          class="w-full h-auto"
        />
      </div>

      <!-- Kolom Form -->
      <div class="w-full">
        <form
          @submit.prevent="handleRegister"
          class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow space-y-6"
        >
          <h2 class="text-2xl font-bold text-center dark:text-white">Register</h2>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition pointer"
          >
            {{ loading ? "Registering..." : "Register" }}
          </button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
            <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">Login</router-link>
          </p>

          <p v-if="success" class="text-center text-green-600 mt-2">{{ success }}</p>
          <p v-if="error" class="text-center text-red-600 mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { register } from '../../services/authService';
  import { RouterLink } from 'vue-router';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  
  const form = reactive({
    username: '',
    email: '',
    password: '',
  });
  
  const loading = ref(false);
  const error = ref('');
  const success = ref('');
  
  async function handleRegister() {
    loading.value = true;
    error.value = '';
    success.value = '';
  
    try {
      await register(form);
      // success.value = res.message || 'Registrasi berhasil';
      success.value = 'Registrasi berhasil. Silakan cek email kamu untuk verifikasi.';
      form.username = '';
      form.email = '';
      form.password = '';
      // router.push('/login');
      router.push('/Verify');
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }
</script>