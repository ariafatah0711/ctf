<template>
  <nav class="bg-gray-900 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-xl font-bold tracking-tight hover:text-gray-300 transition">
            CTF Platform
          </RouterLink>
        </div>

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

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-6 items-center">
          <RouterLink to="/challenges" class="hover:text-gray-300 transition">Challenges</RouterLink>
          <RouterLink to="/leaderboard" class="hover:text-gray-300 transition">Leaderboard</RouterLink>
          <RouterLink to="/about" class="hover:text-gray-300 transition">About</RouterLink>
       </div>

       <div class="hidden md:flex space-x-6 items-center">

       <div v-if="auth.isAuthenticated" class="flex items-center space-x-4">
         <!-- Dropdown User -->
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

          <div v-else class="flex space-x-4">
            <RouterLink to="/login" class="hover:text-blue-300 text-sm transition">Login / SignUp</RouterLink>
            <!-- <RouterLink to="/register" class="hover:text-blue-300 text-sm transition">Register</RouterLink> -->
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
        <RouterLink :to="`/profile/${auth.username}`" class="block hover:text-blue-300">Profile</RouterLink>
        <RouterLink v-if="auth.role === 'admin'" to="/dashboard" class="block hover:text-blue-300">Dashboard</RouterLink>
        <button @click="logout" class="block w-full text-left hover:text-red-400">Logout</button>
      </div>
      <div v-else class="space-y-2">
        <RouterLink to="/login" class="block hover:text-blue-300">Login / SignUp</RouterLink>
        <!-- <RouterLink to="/register" class="block hover:text-blue-300">Register</RouterLink> -->
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

  const Swal = GlobalSwal;
  const auth = useAuthStore();
  const router = useRouter();

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