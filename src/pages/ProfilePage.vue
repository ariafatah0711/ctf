<template>
  <Navbar />
  <div class="h-16"></div>

  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="loading" class="text-gray-500">Memuat profil...</div>
    <div v-else-if="error" class="text-red-500">Gagal memuat profil: {{ error }}</div>
    <div v-else>
      <div class="px-4 sm:px-0">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">User Profile</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">Detail pengguna dan challenge yang telah diselesaikan.</p>
      </div>

      <div class="mt-6 border-t border-gray-200 dark:border-white/10">
        <dl class="divide-y divide-gray-100 dark:divide-white/10">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium text-gray-900 dark:text-white">User ID</dt>
            <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.id }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium text-gray-900 dark:text-white">Username</dt>
            <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.username }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium text-gray-900 dark:text-white">Role</dt>
            <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.role }}</dd>
          </div>

          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium text-gray-900 dark:text-white">Solved Challenges</dt>
            <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              <div v-if="user.solves && user.solves.length">
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="challenge in user.solves" :key="challenge.id">
                    <RouterLink :to="`/challenges/${challenge.id}`" class="text-blue-600 hover:underline dark:text-blue-400">
                      {{ challenge.title }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div v-else class="italic text-gray-400 dark:text-gray-500">Belum menyelesaikan challenge apapun.</div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import { useAuthStore } from '../stores/auth';
  import config from '../config';

  const route = useRoute();
  const username = route.params.username as string;

  const user = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const auth = useAuthStore();
  const token = auth.token;

  onMounted(async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/api/users/username?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal ambil data');

      user.value = result.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
</script>