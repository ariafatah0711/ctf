<!-- components/SubmitFlag.vue
<template>
    <div class="max-w-xl mx-auto bg-white p-6 rounded shadow border">
      <h2 class="text-xl font-bold mb-4 text-blue-700">🚩 Submit Flag</h2>
      <form @submit.prevent="handleSubmit" class="space-y-2">
        <input
          v-model="flag"
          type="text"
          placeholder="Masukkan flag di sini..."
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/auth';
  
  const flag = ref('');
  const message = ref('');
  const error = ref('');
  const auth = useAuthStore();
  const token = auth.token;
  
  const handleSubmit = async () => {
    message.value = '';
    error.value = '';
  
    try {
      const res = await fetch('http://localhost:3000/api/challenges/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flag: flag.value }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Gagal submit flag');
      }
  
      message.value = '✅ Flag benar! Tantangan berhasil diselesaikan.';
      flag.value = '';
    } catch (err: any) {
      error.value = `❌ ${err.message}`;
    }
  };
  </script>
   -->

   <template>
    <div class="max-w-md mx-auto">
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <input
          v-model="flag"
          type="text"
          placeholder="Submit flag..."
          class="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? '...' : 'Submit' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import Swal from 'sweetalert2';
  import { useAuthStore } from '../stores/auth';
  import config from "../config"
  
  const flag = ref('');
  const loading = ref(false);
  const auth = useAuthStore();
  const token = auth.token;
  
  const handleSubmit = async () => {
    if (!flag.value.trim()) {
      Swal.fire({
        text: 'Flag tidak boleh kosong.',
        icon: 'warning',
        confirmButtonText: 'OK',
        showConfirmButton: true,
      });
      return;
    }
  
    loading.value = true;
  
    try {
      const res = await fetch(`${config.BASE_URL}/api/challenges/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flag: flag.value }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Gagal submit flag');
      }
  
      await Swal.fire({
        text: 'Flag benar!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
  
      flag.value = '';
    } catch (err: any) {
      Swal.fire({
        text: err.message || 'Terjadi kesalahan saat submit.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      loading.value = false;
    }
  };
  </script>
  