<template>
  <nav class="bg-gray-900 text-white shadow-md fixed w-full">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-xl font-bold tracking-tight hover:text-gray-300 transition">
            {{ app_name }}
          </RouterLink>
        </div>

        <!-- User Avatar atau Username (Mobile) -->
        <div class="md:hidden focus:outline-none flex gap-4">
          <Menu as="div" class="relative">
            <MenuButton v-if="auth.isAuthenticated"  class="text-sm hover:text-blue-300 transition font-medium flex items-center space-x-2">
              <!-- Avatar Image or Initial -->
              <img
                v-if="auth.avatar"
                :src="auth.avatar"
                alt="Avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span v-else class="w-8 h-8 bg-gray-500 text-white flex items-center justify-center rounded-full">
                {{ auth.username.charAt(0).toUpperCase() }}
              </span>
              <span>{{ auth.username }}</span>
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
                class="absolute right-0 mt-2 w-36 rounded-md bg-white text-black shadow-lg ring-1 ring-black/5 focus:outline-none z-10"
              >
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    :to="`/profile/${auth.username}`"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                  >
                    Profile
                  </RouterLink>
                </MenuItem>
                <MenuItem v-if="auth.role === 'admin'" v-slot="{ active }">
                  <RouterLink
                    to="/dashboard/users"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                  >
                    Dashboard Users
                  </RouterLink>
                </MenuItem>
                <MenuItem v-if="auth.role === 'admin' || auth.role === 'maker'" v-slot="{ active }">
                  <RouterLink
                    to="/dashboard/challenges"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                  >
                    Dashboard Challenges
                  </RouterLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>

          <!-- Hamburger button -->
          <button @click="isOpen = !isOpen" class="md:hidden focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-6 items-center">
          <RouterLink to="/challenges" class="hover:text-gray-300 transition">Challenges</RouterLink>
          <RouterLink to="/leaderboard" class="hover:text-gray-300 transition">Leaderboard</RouterLink>
          <RouterLink to="/about" class="hover:text-gray-300 transition">About</RouterLink>
          <RouterLink v-if="['admin', 'maker', 'user'].includes(auth.role)"  v-slot="{ active }" to="/Dashboard" class="hover:text-gray-300 transition">Dashboard</RouterLink>

          <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
            <!-- Dropdown User -->
            <Menu as="div" class="relative">
              <MenuButton class="text-sm hover:text-blue-300 transition font-medium flex items-center space-x-2">
                <!-- Avatar Image or Initial -->
                <img
                  v-if="auth.avatar"
                  :src="auth.avatar"
                  alt="Avatar"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span v-else class="w-8 h-8 bg-gray-500 text-white flex items-center justify-center rounded-full">
                  {{ auth.username.charAt(0).toUpperCase() }}
                </span>
                <span>{{ auth.username }}</span>
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
                  class="absolute right-0 mt-2 w-36 rounded-md bg-white text-black shadow-lg ring-1 ring-black/5 focus:outline-none z-10"
                >
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      :to="`/profile/${auth.username}`"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                    >
                      Profile
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-if="auth.role === 'admin'" v-slot="{ active }">
                    <RouterLink
                      to="/dashboard/users"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                    >
                      Dashboard Users
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-if="auth.role === 'admin' || auth.role === 'maker'" v-slot="{ active }">
                    <RouterLink
                      to="/dashboard/challenges"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']"
                    >
                      Dashboard Challenges
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <div v-else class="flex space-x-4">
            <RouterLink to="/login" class="hover:text-blue-300 text-sm transition">Login</RouterLink>
            <RouterLink to="/register" class="hover:text-blue-300 text-sm transition">SignUp</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2">
      <RouterLink to="/challenges" class="block hover:text-gray-300">Challenges</RouterLink>
      <RouterLink to="/leaderboard" class="block hover:text-gray-300">Leaderboard</RouterLink>
      <RouterLink to="/about" class="block hover:text-gray-300">About</RouterLink>

      <div v-if="auth.isAuthenticated" class="space-y-2">
        <RouterLink v-if="['admin', 'maker', 'user'].includes(auth.role)"  v-slot="{ active }" to="/dashboard" class="block hover:text-blue-300">Dashboard</RouterLink>
      </div>
      <div v-else class="space-y-2">
        <RouterLink to="/login" class="block hover:text-blue-300">Login</RouterLink>
        <RouterLink to="/register" class="block hover:text-blue-300">SignUp</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import { onMounted, ref } from 'vue';
  import GlobalSwal from '../utills/GlobalSwal';
  import packageInfo from "../../package.json";

  const Swal = GlobalSwal;
  const auth = useAuthStore();
  const router = useRouter();
  const app_name = packageInfo.name;

  onMounted(async () => {
    if (auth.token && !auth.isAuthChecked) {
      await auth.checkAuth();
    }
  });

  const isOpen = ref(false);

  // const logout = () => {
  //   auth.logout();
  //   router.push('/login');
  // };

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