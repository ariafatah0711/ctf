<!-- <template>
    <div class="p-4">
      <h1 class="text-xl font-bold">Selamat datang</h1>
      <p class="text-green-600">Already logged in ✅</p>
  
      <button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const logout = () => {
    auth.logout();
    router.push('/login');
  };
  </script>
   -->

   <template>
    <div class="p-4">
      <h1 class="text-xl font-bold">Selamat datang, {{ username }}</h1>
      <p class="text-green-600">Already logged in ✅</p>
  
      <button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const router = useRouter();
  
  const username = ref('');
  
  // Ambil data user saat component dimount
  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/me', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Gagal mengambil data user');
      }
  
      const data = await res.json();
      username.value = data.user.username; // atau `data.data.username` tergantung respon API kamu
    } catch (err) {
      console.error(err);
      router.push('/login'); // jika token invalid, redirect ke login
    }
  });
  
  const logout = () => {
    auth.logout();
    router.push('/login');
  };
  </script>
  