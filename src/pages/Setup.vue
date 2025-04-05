
   <template>
    <div class="setup-page">
      <h1 class="text-2xl font-bold mb-4">Setup Admin</h1>
  
      <!-- Cek jika setup sudah dilakukan -->
      <div v-if="setupCompleted">
        <p class="text-green-500">Setup sudah dilakukan! Anda tidak dapat mengatur ulang admin.</p>
      </div>
      <!-- Form Setup Admin jika setup belum dilakukan -->
      <div v-else>
        <form @submit.prevent="handleSetup" class="space-y-4">
          <div>
            <label for="email" class="block mb-1">Email Admin</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-1">Password Admin</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              required
            />
          </div>
          <button
            type="submit"
            class="btn"
            :disabled="loading"
          >
            {{ loading ? 'Memproses...' : 'Setup' }}
          </button>
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
          <p v-if="success" class="text-green-500 mt-2">Setup berhasil! Redirect ke login...</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import config from "../config"
  
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  const setupCompleted = ref(false)
  const router = useRouter()
  
  // Cek apakah setup sudah dilakukan ketika komponen di-mount
  onMounted(async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/checkSetup`);
      if (res.ok) {
        const data = await res.json();
        if (data.message === "Setup sudah dilakukan.") {
          setupCompleted.value = true;
        }
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat memeriksa status setup.", err);
    }
  })
  
  const handleSetup = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(`${config.BASE_URL}/api/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Setup gagal');
      }

      success.value = true;
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      error.value = err.message || 'Gagal melakukan setup';
    } finally {
      loading.value = false;
    }
  }
  </script>
  
  <style scoped>
  .input {
    border: 1px solid #ccc;
    padding: 0.5rem;
    width: 100%;
    border-radius: 0.375rem;
  }
  .btn {
    background-color: #4f46e5;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  </style>
  