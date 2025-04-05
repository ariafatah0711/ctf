<!-- <template>
    <nav class="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <h1 class="text-2xl font-bold tracking-tight">
        <RouterLink to="/" class="hover:text-gray-300 transition">⚔️ CTF Platform</RouterLink>
      </h1>

      <RouterLink to="/leaderboard" class="mr-4">Leaderboard</RouterLink>
  
      <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
        <span class="text-sm sm:text-base">
          <RouterLink :to="`/profile/${auth.username}`" class="hover:text-blue-300 text-sm sm:text-base transition">
            👋 <span class="font-medium">{{ auth.username }}</span>
          </RouterLink>
        </span>
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
  
      <div v-else class="flex items-center space-x-4">
        <RouterLink
          to="/login"
          class="hover:text-blue-300 text-sm sm:text-base transition"
        >
          Login
        </RouterLink>
        <RouterLink
          to="/register"
          class="hover:text-blue-300 text-sm sm:text-base transition"
        >
          Register
        </RouterLink>
      </div>
    </nav>
</template>

<script setup lang="ts">
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const auth = useAuthStore();
  const router = useRouter();
  
  onMounted(async () => {
    try {
      if (!auth.username) {
        await auth.checkAuth();
      }
    } catch (err) {
      console.error(err);
    }
  });
  
  const logout = () => {
    auth.logout();
    router.push('/login');
  };
</script> -->

<template>
  <nav class="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
    <!-- LEFT NAV -->
    <div class="flex items-center space-x-6">
      <RouterLink to="/" class="text-xl font-bold tracking-tight hover:text-gray-300 transition">
        CTF Platform
      </RouterLink>
      <RouterLink to="/challenges" class="hover:text-gray-300 transition">Challenges</RouterLink>
      <RouterLink to="/leaderboard" class="hover:text-gray-300 transition">Leaderboard</RouterLink>
      <RouterLink to="/info" class="hover:text-gray-300 transition">Info</RouterLink>
    </div>

    <!-- RIGHT NAV -->
    <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
      <Menu as="div" class="relative">
        <MenuButton class="text-sm hover:text-blue-300 transition font-medium">
          {{ auth.username }}
        </MenuButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems class="absolute right-0 mt-2 w-36 rounded-md bg-white text-black shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
            <MenuItem v-slot="{ active }">
              <RouterLink
                :to="`/profile/${auth.username}`"
                :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
              >
                Profile
              </RouterLink>
            </MenuItem>

            <MenuItem v-if="auth.role == 'admin'" v-slot="{ active }">
              <RouterLink
                to="/dashboard"
                :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
              >
                Dashboard
              </RouterLink>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>

      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium transition"
      >
        Logout
      </button>
    </div>

    <div v-else class="flex items-center space-x-4">
      <RouterLink to="/login" class="hover:text-blue-300 text-sm sm:text-base transition">
        Login
      </RouterLink>
      <RouterLink to="/register" class="hover:text-blue-300 text-sm sm:text-base transition">
        Register
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const auth = useAuthStore();
const router = useRouter();

// onMounted(async () => {
//   if (!auth.username) {
//     try {
//       await auth.checkAuth();
//     } catch (err) {
//       console.error(err);
//     }
//   }
// });

onMounted(async () => {
  if (auth.token && !auth.isAuthChecked) {
    await auth.checkAuth();
  }
});

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>