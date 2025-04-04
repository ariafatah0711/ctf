<!-- <template>
  <Navbar />

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4 bg-amber-300">🧠 Daftar Tantangan</h1>
    <ChallengeList />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import ChallengeList from '../components/ChallengeList.vue';
</script> -->

<!-- test -->

<!-- <template>
  <Navbar />

  <div class="p-4 space-y-8">
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

    <div>
      <h1 class="text-2xl font-bold mb-4 text-amber-700">🧠 Daftar Tantangan</h1>
      <ChallengeList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import ChallengeList from '../components/ChallengeList.vue';
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
</script> -->

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import SubmitFlag from '../components/SubmitFlag.vue';
import ChallengeList from '../components/ChallengeList.vue';
</script>

<template>
  <Navbar />

  <div class="p-4 space-y-8">
    <SubmitFlag />
    <div>
      <h1 class="text-2xl font-bold mb-4 text-amber-700">🧠 Daftar Tantangan</h1>
      <ChallengeList />
    </div>
  </div>
</template>
