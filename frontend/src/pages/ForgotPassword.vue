<template>
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
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
          </button>
          <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">Kembali ke Login</router-link>
          </p>
        </form>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { forgotPassword } from '../services/authService';
  import GlobalSwal from '../utills/GlobalSwal';
  const Swal = GlobalSwal;
  
  const email = ref('');
  const loading = ref(false);
  
  async function handleForgotPassword() {
    loading.value = true;
    try {
      await forgotPassword(email.value);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Link reset password telah dikirim ke email kamu.',
      });
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
    } finally {
      loading.value = false;
    }
  }
</script>