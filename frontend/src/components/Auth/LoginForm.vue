<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Kolom Gambar -->
      <div class="hidden md:block">
        <img
          src="../../assets/1.png"
          alt="Login Illustration"
          class="w-full h-auto"
        />
      </div>

      <!-- Kolom Form -->
      <div class="w-full">
        <form
          @submit.prevent="handleLogin"
          class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow space-y-6"
        >
          <h2 class="text-2xl font-bold text-center dark:text-white">Login</h2>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <input type="checkbox" class="form-checkbox text-blue-600" />
              Remember me
            </label>
            <router-link to="/forgot-password" class="text-blue-600 hover:underline dark:text-blue-400">Forgot password?</router-link>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <p class="text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?
            <router-link to="/register" class="text-blue-600 hover:underline dark:text-blue-400">Register</router-link>
          </p>

          <p v-if="error" class="text-center text-red-600 mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { login } from '../../services/authService';
  import { useAuthStore } from '../../stores/auth';
  import GlobalSwal from '../../utills/GlobalSwal';
  const Swal = GlobalSwal;
  
  const router = useRouter();
  // const authStore = useAuthStore();
  
  const form = reactive({
    email: '',
    password: '',
  });
 
  const loading = ref(false);
  const error = ref('');
  
  async function handleLogin() {
    try {
      // const { session, user } = await loginRequest({ email, password });
      const { session, user } = await login(form);
      const auth = useAuthStore();
      auth.login(session, user);
      await auth.checkAuth();
      router.push('/challenges'); // redirect ke dashboard/home
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Login gagal', text: err.message });
    }
  }
</script>  