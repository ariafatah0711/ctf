<template>
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap items-center justify-center lg:justify-between min-h-screen">
      <!-- Optional image -->
      <div class="hidden md:block md:w-6/12 lg:w-5/12 xl:w-6/12">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.webp"
          class="w-full"
          alt="Register image"
        />
      </div>

      <!-- Register form -->
      <div class="w-full md:w-6/12 lg:w-5/12 xl:w-4/12">
        <form @submit.prevent="handleRegister" class="bg-white dark:bg-gray-800 p-8 rounded shadow-md space-y-6">
          <h2 class="text-2xl font-bold text-center dark:text-white">Register</h2>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
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
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
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
      const res = await register(form);
      success.value = res.message || 'Registrasi berhasil';
      form.username = '';
      form.email = '';
      form.password = '';
      router.push('/login');
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }
</script>