<template>
  <nav class="bg-white text-black dark:bg-gray-900 dark:text-white shadow-md fixed w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <RouterLink to="/" class="text-xl font-bold tracking-tight hover:text-gray-300 transition">
            {{ app_name }}
          </RouterLink>
        </div>

        <!-- Nav Tengah (Desktop) -->
        <div class="hidden md:flex flex-1 justify-center space-x-6">
          <RouterLink v-if="auth.isAuthenticated" to="/challenges" class="hover:text-blue-400 transition">Challenges</RouterLink>
          <RouterLink to="/leaderboard" class="hover:text-blue-400 transition">Leaderboard</RouterLink>
          <RouterLink v-if="auth.isAuthenticated" to="/history" class="hover:text-blue-400 transition">history</RouterLink>
          <RouterLink v-if="auth.isAuthenticated" to="/dashboard" class="hover:text-blue-400 transition">Dashboard</RouterLink>
          <RouterLink to="/about" class="hover:text-blue-400 transition">About</RouterLink>
        </div>

        <!-- Kanan: Avatar atau Login + Dark Mode -->
        <div class="hidden md:flex items-center space-x-4">
          <DarkModeToggle />
          <div v-if="auth.isAuthenticated">
            <Menu as="div" class="relative">
              <MenuButton class="text-sm hover:text-blue-300 transition font-medium flex items-center space-x-2">
                <img
                  v-if="auth.user.avatar"
                  :src="auth.user.avatar"
                  alt="Avatar"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span v-else class="w-8 h-8 bg-gray-500 text-white flex items-center justify-center rounded-full">
                  <!-- {{ auth.user.username.charAt(0).toUpperCase() }} -->
                  {{ auth.user?.username?.charAt(0).toUpperCase() || 'N/A' }}
                </span>
                <!-- <span>{{ auth.user.username }}</span> -->
              </MenuButton>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
              <MenuItems
                  class="absolute right-0 mt-2 w-44 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-10"
                >
                  <!-- Mini Profile Info -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ auth.user.username }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ auth.user.email || 'No email' }}</p>
                    <span
                      class="mt-1 inline-block text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-white">
                      {{ auth.user.role }}
                    </span>
                  </div>

                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      :to="`/profile`"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-4 py-2 text-sm transition'
                      ]"
                    >
                      Profile
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-if="auth.user.role === 'admin'" v-slot="{ active }">
                    <RouterLink
                      to="/dashboard/users"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-4 py-2 text-sm transition'
                      ]"
                    >
                      Dashboard Users
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-if="auth.user.role === 'admin' || auth.user.role === 'maker'" v-slot="{ active }">
                    <RouterLink
                      to="/dashboard/challenges"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-4 py-2 text-sm transition'
                      ]"
                    >
                      Dashboard Challenges
                    </RouterLink>
                  </MenuItem>
                  <MenuItem>
                    <button
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div v-else class="flex space-x-3">
            <!-- <RouterLink to="/login" class="hover:text-blue-300 text-sm">Sign In</RouterLink> -->
            <RouterLink to="/login"
              class="border border-blue-500 text-blue-500 px-4 py-1 rounded-md hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black text-sm transition">
              Sign In</RouterLink>
            <!-- <RouterLink to="/register" class="hover:text-blue-300 text-sm">Sign Up</RouterLink> -->
          </div>
        </div>

        <!-- Mobile: Dark mode + hamburger -->
        <div class="md:hidden flex items-center gap-4">
          <DarkModeToggle />
          <button @click="isOpen = !isOpen" class="focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2 text-black dark:text-white">
      <!-- Mini Profile Info (Mobile) -->
      <!-- <RouterLink to="/profile"> -->
        <div v-if="auth.isAuthenticated" class="pt-4 pb-2 border-t border-gray-300 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <img
              v-if="auth.user.avatar"
              :src="auth.user.avatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="text-sm font-medium">{{ auth.user.username }}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ auth.user.email || 'No email' }}</p>
              <span class="mt-1 inline-block text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-white">
                {{ auth.user.role }}
              </span>
            </div>
          </div>
        </div>
      <!-- </RouterLink> -->

      <!-- Navigation -->
      <RouterLink v-if="auth.isAuthenticated" to="/challenges" class="block hover:text-blue-400 transition">Challenges</RouterLink>
      <RouterLink to="/leaderboard" class="block hover:text-blue-400 transition">Leaderboard</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/history" class="block hover:text-blue-400 transition">History</RouterLink>
      <RouterLink v-if="auth.isAuthenticated" to="/dashboard" class="block hover:text-blue-400 transition">Dashboard</RouterLink>
      <RouterLink to="/about" class="block hover:text-blue-400 transition">About</RouterLink>

      <!-- Extra Links -->
      <div v-if="auth.isAuthenticated" class="pt-2 space-y-1 border-t border-gray-300 dark:border-gray-700">
        <RouterLink to="/profile" class="block hover:text-blue-300 transition">Profile</RouterLink>
        <RouterLink v-if="auth.user.role === 'admin'" to="/dashboard/users" class="block hover:text-blue-300 transition">
          Dashboard Users
        </RouterLink>
        <RouterLink v-if="['admin', 'maker'].includes(auth.user.role)" to="/dashboard/challenges" class="block hover:text-blue-300 transition">
          Dashboard Challenges
        </RouterLink>
        <button @click="logout" class="block w-full text-left hover:text-red-400 transition">Logout</button>
      </div>

      <!-- Guest -->
      <div v-else class="pt-2 space-y-1 border-t border-gray-300 dark:border-gray-700">
        <RouterLink
          to="/login"
          class="block border border-blue-500 text-blue-500 text-center px-4 py-1.5 rounded-md hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black text-sm transition"
        >
          Sign In
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import { onMounted, onUnmounted, ref } from 'vue';
  import DarkModeToggle from "../components/DarkModeToggle.vue"
  import GlobalSwal from '../utills/GlobalSwal';
  import packageInfo from "../../package.json";

  const Swal = GlobalSwal;
  const auth = useAuthStore();
  const router = useRouter();
  const app_name = packageInfo.name;

  // onMounted(async () => {
  //   if (auth.user.token && !auth.isAuthChecked) {
  //     await auth.checkAuth();
  //   }
  // });

  const isOpen = ref(false);

  const handleScroll = () => {
    isOpen.value = false;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    router.afterEach(() => {
      isOpen.value = false;
    });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  const logout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Yakin ingin logout dari akun ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        auth.logout();
        router.push('/login');

        Swal.fire({
          title: 'Logged out',
          text: 'Kamu berhasil logout.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
</script>