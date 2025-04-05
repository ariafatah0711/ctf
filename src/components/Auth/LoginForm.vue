<!-- <template>
    <form @submit.prevent="handleLogin" class="space-y-4 max-w-sm mx-auto">
      <h2 class="text-xl font-bold">Login</h2>
  
      <div>
        <label for="username">Username</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
  
      <div>
        <label for="password">Password</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>
  
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <router-link to="/register" class="inline-block text-sm text-blue-500 hover:underline">
        Belum punya akun? Register
      </router-link>
  
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  // import { useLink, useRouter, RouterLink } from 'vue-router';
  import { useRouter, RouterLink } from 'vue-router';
  import { login } from '../../services/authService';
  import { useAuthStore } from '../../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const form = reactive({
    username: '',
    password: '',
  });
  
  const loading = ref(false);
  const error = ref('');
  
  async function handleLogin() {
    loading.value = true;
    error.value = '';
  
    try {
      const res = await login(form); // login ke API
      authStore.login(res.token); // simpan ke Pinia
      router.push('/'); // redirect ke halaman utama
      // const res = await login(form);
      // authStore.setToken(res.token);
      // router.push('/'); // arahkan ke home atau dashboard
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }
  </script> -->

<template>  
    <!-- <section class="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"> -->
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center lg:justify-between">
          <!-- Left column with image -->
          <div class="hidden md:block md:w-6/12 lg:w-5/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              class="w-full"
              alt="Sample image"
            />
          </div>
  
          <!-- Right column with login form -->
          <div class="w-full md:w-6/12 lg:w-5/12 xl:w-4/12">
            <form @submit.prevent="handleLogin" class="bg-white dark:bg-gray-800 p-8 rounded shadow-md space-y-6">
              <h2 class="text-2xl font-bold text-center dark:text-white">Login</h2>
  
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  email
                </label>
                <input
                  v-model="form.email"
                  type="text"
                  id="email"
                  class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  class="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
  
              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <input type="checkbox" class="form-checkbox text-blue-600" />
                  Remember me
                </label>
                <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
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
    <!-- </section> -->
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
  
  // async function handleLogin() {
  //   loading.value = true;
  //   error.value = '';
  
  //   try {
  //     const res = await login(form); // call API
  //     authStore.login(res.token);    // simpan token ke Pinia
  //     router.push('/');              // redirect ke home
  //   } catch (err: any) {
  //     error.value = err.message;
  //   } finally {
  //     loading.value = false;
  //   }
  // }
  async function handleLogin() {
    try {
      // const { session, user } = await loginRequest({ email, password });
      const { session, user } = await login(form);
      const auth = useAuthStore();
      auth.login(session, user);
      router.push('/'); // redirect ke dashboard/home
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Login gagal', text: err.message });
    }
  }
</script>  