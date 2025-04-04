<!-- <template>
<nav class="flex items-center justify-between p-4 bg-gray-800 text-white">
<h1 class="text-lg font-bold">My CTF App</h1>

<div v-if="auth.isAuthenticated">
<span class="mr-4">👋 {{ auth.username }}</span>
<button @click="logout" class="bg-red-500 px-3 py-1 rounded">Logout</button>
</div>

<div v-else>
<RouterLink to="/login" class="mr-4">Login</RouterLink>
<RouterLink to="/register">Register</RouterLink>
</div>
</nav>
</template>

<script setup lang="ts">
    import { useAuthStore } from '../stores/auth';
    import { useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue';

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
</script>