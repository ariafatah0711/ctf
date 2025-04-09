<template>
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-md mx-auto">
      <ProfileSkeleton v-if="loading" />

      <div v-else-if="error" class="text-red-500 text-center">Gagal memuat profil: {{ error }}</div>

      <div v-else>
        <div class="flex flex-col items-center space-y-4 mb-6">
          <img
            :src="user.avatar"
            alt="Avatar"
            class="w-24 h-24 rounded-full shadow-lg ring-2 ring-blue-500"
          />
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ user.username }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-300">{{ user.role }}</p>

            <button
              v-if="isOwnProfile"
              @click="showForm = true"
              class="mt-2 px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-white/10 pt-4">
          <dl class="divide-y divide-gray-100 dark:divide-white/10">
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">User ID</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0 truncate">{{ user.id }}</dd>
            </div>

            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Email</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.email }}</dd>
            </div>

            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Username</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.username }}</dd>
            </div>

            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Role</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.role }}</dd>
            </div>

            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Solved Challenges</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                <div v-if="user.solves && user.solves.length">
                  <ul class="list-disc list-inside space-y-1 truncate">
                    <li v-for="challenge in user.solves" :key="challenge.id">
                      <RouterLink :to="`/challenges/${challenge.id}`" class="text-blue-600 hover:underline dark:text-blue-400 truncate">
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
  </div>
  <Teleport to="body">
    <div v-if="showForm && isOwnProfile" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <EditProfileForm
        v-if="user && user.id"
        type="edit"
        :initialData="{
          id: user.id,
          name: user.username,
          email: user.email,
        }"
        @submit="handleUpdateProfile"
      />
      <button
        @click="showForm = false"
        class="absolute top-4 right-4 text-white text-3xl hover:text-red-400 transition duration-200 z-50"
        aria-label="Tutup form">❌</button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeUnmount, watch, ref, onMounted } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import ProfileSkeleton from '../components/skelaton/ProfileSkeleton.vue'
  import EditProfileForm from '../components/profile/EditProfileForm.vue';
  import { useAuthStore } from '../stores/auth';
  import config from '../config';
  import { swalSuccess, swalError } from '../utills/swalAlert'

  const route = useRoute();
  // const username = route.params.username as string | undefined;
  const username = computed(() => route.params.username as string | undefined);

  const user = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const auth = useAuthStore();
  const token = auth.user.token;

  const showForm = ref(false);
  function openEditForm() {
    showForm.value = true
  }

  import { computed } from 'vue';

  const isOwnProfile = computed(() => {
    return route.path === '/profile';
    // return true;  // disable security
  });

  async function handleUpdateProfile(data: any) {
    try {
      const res = await fetch(`${config.BASE_URL}/api/users/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) throw new Error(result.error || 'Gagal update profil');

      // Update data lokal user
      user.value = {
        ...user.value,
        ...result.user,
      };

      showForm.value = false;

      // Cek apakah email atau password diubah, dan login ulang
      const updatedEmail = data.email;
      const updatedPassword = data.password;

      if (updatedEmail && updatedPassword) {
        const { login } = await import('../services/authService'); // lazy import
        const { session, user: newUser } = await login({
          email: updatedEmail,
          password: updatedPassword,
        });
        auth.login(session, newUser);
        await auth.checkAuth();

        // Kalau sebelumnya pakai rememberMe, update di localStorage
        const encrypted = localStorage.getItem('auth_data');
        if (encrypted) {
          const { encryptAuthData } = await import('../utills/crypto');
          const updatedEncrypted = encryptAuthData(updatedEmail, updatedPassword);
          localStorage.setItem('auth_data', updatedEncrypted);
        }
      }

      swalSuccess('Profil berhasil diperbarui!');
    } catch (err: any) {
      swalError(err.message || 'Terjadi kesalahan saat update profil.');
    }
  }

  // onMounted(async () => {
  //   try {
  //     const targetUsername = username ?? auth.user.username;
  //     const res = await fetch(`${config.BASE_URL}/api/users?username=${targetUsername}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const result = await res.json();
  //     console.log(result)
  //     if (!res.ok) throw new Error(result.message || 'Gagal ambil data');

  //     user.value = result.data;
  //   } catch (err: any) {
  //     error.value = err.message;
  //   } finally {
  //     loading.value = false;
  //   }
  // });

  const fetchUserProfile = async () => {
    loading.value = true;
    error.value = null;

    try {
      // const targetUsername = username ?? auth.user.username;
      const targetUsername = username.value ?? auth.user.username;
      const res = await fetch(`${config.BASE_URL}/api/users?username=${targetUsername}`, {
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
      await auth.checkAuth()
    }
  };

  onMounted(fetchUserProfile);
  // watch(() => route.params.username, fetchUserProfile);
  watch(username, fetchUserProfile);

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      fetchUserProfile();
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibility);
  });
</script>