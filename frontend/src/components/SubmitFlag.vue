<template>
    <div class="max-w-full mx-auto">
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <input
          v-model="flag"
          type="text"
          :placeholder="'Submit ' + format_flag"
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
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const flag = ref('');
  const loading = ref(false);
  const auth = useAuthStore();
  const token = auth.token;
  const format_flag = ref(config.FLAG_FORMAT);
  
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
      }).then(() => {
        // location.reload(); // Refresh halaman setelah alert selesai
        router.push('/challenges');
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