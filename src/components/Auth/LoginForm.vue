<template>
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
      <!-- <button type="submit" :disabled="loading"class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> -->
        <router-link :to="`/register`" class="text-blue-500 hover:underline">register</router-link>
      <!-- </button> -->
  
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useLink, useRouter, RouterLink } from 'vue-router';
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
  </script>