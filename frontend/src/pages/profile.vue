<template>
  <div class="w-full flex justify-center">
    <!-- <div class="p-4 w-full max-w-screen-md mx-auto"> -->
      <div class="p-6 w-full max-w-screen-lg mx-auto">
      <!-- Skeleton Loading -->
      <ProfileSkeleton v-if="loading" />

      <!-- Error Message -->
      <div v-else-if="error" class="text-red-500 text-center">
        Gagal memuat profil: {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else>
        <div class="flex flex-col items-center space-y-4 mb-6">
          <!-- Avatar -->
          <img
            :src="user.avatar"
            alt="Avatar"
            class="w-24 h-24 rounded-full shadow-lg ring-2 ring-blue-500"
          />
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
              {{ user.username }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-300">{{ user.role }}</p>

            <div class="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <!-- Edit Profile Button -->
              <button v-if="isOwnProfile"
                @click="showForm = true"
                class="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                ✏️ Edit Profile
              </button>

              <!-- View History Link -->
              <RouterLink
                :to="`/history?id=${user.id}&user=${user.username}`"
                class="px-4 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                📜 Lihat Riwayat
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="border-t border-gray-200 dark:border-white/10 pt-4">
          <dl class="divide-y divide-gray-100 dark:divide-white/10">
            <!-- User ID -->
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">User ID</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0 truncate">{{ user.id }}</dd>
            </div>

            <!-- Email -->
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Email</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.email }}</dd>
            </div>

            <!-- Username -->
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Username</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.username }}</dd>
            </div>

            <!-- Role -->
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Role</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">{{ user.role }}</dd>
            </div>

            <!-- Difficulty Breakdown -->
            <div class="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Difficulty Breakdown</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:flex sm:flex-wrap sm:gap-4 sm:mt-0">
                <div
                  v-for="(percent, level) in user.percentages?.difficulty"
                  :key="level"
                  class="flex-1 flex flex-col space-y-2"
                >
                  <div class="flex justify-between items-center w-full">
                    <!-- Difficulty Level Link -->
                    <RouterLink
                      :to="`/challenges?difficulty=${level === 'easy' ? 1 : level === 'medium' ? 2 : level === 'hard' ? 3 : level}`"
                      class="capitalize truncate w-1/2 text-blue-500 hover:underline pt-1"
                    >
                      {{ level }}
                    </RouterLink>
                    <span class="truncate w-1/3 text-right">{{ percent }}%</span>
                  </div>
                  <div class="w-full h-2 rounded bg-gray-200 dark:bg-gray-700 mt-1">
                    <div
                      class="h-full rounded bg-blue-500 transition-all duration-500"
                      :style="{ width: percent + '%' }"
                    ></div>
                  </div>
                </div>
              </dd>
            </div>

            <!-- Tags Breakdown -->
            <div class="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white">Tags Breakdown</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:flex sm:flex-wrap sm:gap-4 sm:mt-0">
                <div
                  v-for="(percent, tag) in user.percentages?.tags"
                  :key="tag"
                  class="flex-1 flex flex-col space-y-2"
                >
                  <!-- Tag Link with Percentage -->
                  <RouterLink
                    :to="`/challenges?tags=${tag}`"
                    class="font-medium text-gray-900 dark:text-white hover:text-blue-500 flex justify-between items-center pt-1"
                  >
                    <span class="truncate">{{ tag }}</span>
                    <span class="text-sm text-gray-700 dark:text-gray-300 truncate text-right pl-1">{{ percent }}%</span>
                  </RouterLink>
                  <div class="w-full h-2 rounded bg-gray-200 dark:bg-gray-700 mt-1">
                    <div
                      class="h-full rounded bg-green-500 transition-all"
                      :style="{ width: percent + '%' }"
                    ></div>
                  </div>
                </div>
              </dd>
            </div>

            <!-- Solved Challenges -->
            <div class="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:px-0">
              <dt class="text-sm font-medium text-gray-900 dark:text-white col-span-1 sm:col-span-2">
                Solved Challenges
              </dt>

              <!-- Easy Challenges (Full width on all screens) -->
              <div class="flex flex-col space-y-2 rounded-lg truncate sm:col-span-2">
                <div class="font-medium text-gray-900 dark:text-white mb-2 pt-2">Easy</div>
                <div v-if="user.solves && user.solves.filter(c => c.difficulty === 1).length">
                  <div class="flex flex-wrap gap-2">
                    <routerLink
                      v-for="challenge in user.solves.filter(c => c.difficulty === 1)"
                      :key="challenge.id"
                      :to="`/challenges/${challenge.id}`"
                      class="bg-green-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-green-700 transition duration-300 transform hover:scale-105 truncate"
                    >
                      {{ challenge.title }}
                    </routerLink>
                  </div>
                </div>
                <div v-else class="italic text-gray-400 dark:text-gray-500">Belum menyelesaikan challenge easy.</div>
              </div>

              <!-- Medium Challenges -->
              <div class="flex flex-col space-y-2 rounded-lg truncate">
                <div class="font-medium text-gray-900 dark:text-white mb-2 pt-2">Medium</div>
                <div v-if="user.solves && user.solves.filter(c => c.difficulty === 2).length">
                  <div class="flex flex-wrap gap-2">
                    <routerLink
                      v-for="challenge in user.solves.filter(c => c.difficulty === 2)"
                      :key="challenge.id"
                      :to="`/challenges/${challenge.id}`"
                      class="bg-yellow-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-yellow-700 transition duration-300 transform hover:scale-105 truncate"
                    >
                      {{ challenge.title }}
                    </routerLink>
                  </div>
                </div>
                <div v-else class="italic text-gray-400 dark:text-gray-500">Belum menyelesaikan challenge medium.</div>
              </div>

              <!-- Hard Challenges -->
              <div class="flex flex-col space-y-2 rounded-lg truncate">
                <div class="font-medium text-gray-900 dark:text-white mb-2 pt-2">Hard</div>
                <div v-if="user.solves && user.solves.filter(c => c.difficulty === 3).length">
                  <div class="flex flex-wrap gap-2">
                    <routerLink
                      v-for="challenge in user.solves.filter(c => c.difficulty === 3)"
                      :key="challenge.id"
                      :to="`/challenges/${challenge.id}`"
                      class="bg-red-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-red-700 transition duration-300 transform hover:scale-105 truncate"
                    >
                      {{ challenge.title }}
                    </routerLink>
                  </div>
                </div>
                <div v-else class="italic text-gray-400 dark:text-gray-500">Belum menyelesaikan challenge hard.</div>
              </div>
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
        @cancel="showForm = false"
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
import { onBeforeUnmount, watch, ref, onMounted, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import ProfileSkeleton from '../components/skelaton/ProfileSkeleton.vue';
import EditProfileForm from '../components/profile/EditProfileForm.vue';
import { useAuthStore } from '../stores/auth';
import { swalSuccess, swalError } from '../utils/swalAlert.ts';
import { useProfileData } from "../services/useProfileData.ts";
import { updateUserProfile, reLoginIfNeeded } from "../services/profileService.ts";

const route = useRoute();
const auth = useAuthStore();

const showForm = ref(false);
const username = computed(() => route.params.username as string | undefined);
const isOwnProfile = computed(() => route.path === '/profile' || username.value === auth.user.username);
const targetUsername = computed(() => username.value ?? auth.user.username);

const { user, isValidating, error, mutate } = useProfileData(targetUsername.value);
const loading = computed(() => isValidating.value && !user.value);

async function handleUpdateProfile(data: any) {
  try {
    const result = await updateUserProfile(data, auth.user.token);

    user.value = { ...user.value, ...result.user };
    showForm.value = false;

    await reLoginIfNeeded(data.email, data.password);
    await auth.checkAuth();

    swalSuccess('Profil berhasil diperbarui!');
  } catch (err: any) {
    swalError(err.message || 'Terjadi kesalahan saat update profil.');
  }
}

const handleVisibility = () => {
  if (document.visibilityState === 'visible') mutate();
};

watch(() => route.query, () => location.reload(), { deep: true });

document.addEventListener('visibilitychange', handleVisibility);
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibility);
});
</script>
