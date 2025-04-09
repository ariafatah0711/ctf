<!-- <template>
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
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, RouterLink } from 'vue-router';
  import ProfileSkeleton from '../components/skelaton/ProfileSkeleton.vue'
  import { useAuthStore } from '../stores/auth';
  import config from '../config';

  const route = useRoute();
  // const username = route.params.username as string;
  const username = route.params.username as string | undefined;

  const user = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const auth = useAuthStore();
  const token = auth.user.token;

  onMounted(async () => {
    try {
      const targetUsername = username ?? auth.user.username;
      const res = await fetch(`${config.BASE_URL}/api/users?username=${targetUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log(result)
      if (!res.ok) throw new Error(result.message || 'Gagal ambil data');

      user.value = result.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
</script> -->

<template>
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-md mx-auto">
      <ProfileSkeleton v-if="isValidating" />

      <div v-else-if="error" class="text-red-500 text-center">Gagal memuat profil: {{ error.message }}</div>

      <div v-else-if="user">
        <div class="flex flex-col items-center space-y-4 mb-6">
          <img
            :src="user.avatar"
            alt="Avatar"
            class="w-24 h-24 rounded-full shadow-lg ring-2 ring-blue-500"
          />
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">{{ user.username }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-300">{{ user.role }}</p>
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
</template>

<script setup lang="ts">
import useSWRV from 'swrv';
import { useRoute, RouterLink } from 'vue-router';
import { onActivated, watch, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import config from '../config';
import ProfileSkeleton from '../components/skelaton/ProfileSkeleton.vue';

const route = useRoute();
const auth = useAuthStore();

const username = route.params.username as string || auth.user.username;
const token = auth.user.token;

const fetcher = async (key: string) => {
  const res = await fetch(key, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Gagal ambil data');
  return json.data;
};

const { data, error, isValidating, mutate } = useSWRV(
  () => `${config.BASE_URL}/api/users?username=${username}`,
  fetcher,
  { revalidateOnFocus: false }
);

// Bind ke template sebagai computed
const user = computed(() => data.value);

// Revalidate saat tab difokuskan lagi
onActivated(() => {
  mutate();
});

// Revalidate saat ganti user (route berubah)
watch(() => route.params.username, () => {
  mutate();
});
</script>