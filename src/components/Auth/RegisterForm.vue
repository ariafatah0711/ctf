<template>
    <form @submit.prevent="handleRegister" class="space-y-4 max-w-sm mx-auto">
      <h2 class="text-xl font-bold">Register</h2>
  
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
        <label for="email">Email</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
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
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>
      <!-- <button type="submit" :disabled="loading"class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> -->
       <router-link :to="`/login`" class="text-blue-500 hover:underline">login</router-link>
      <!-- </button> -->
  
      <p v-if="success" class="text-green-600 mt-2">{{ success }}</p>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </form>
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

  // const onSubmit = async () => {
  //   try {
  //     await authService.register(username.value, email.value, password.value);
  //     router.push('/login'); // Redirect ke login setelah sukses
  //   } catch (err: any) {
  //     error.value = err.message;
  //   }
  // };
  
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
  