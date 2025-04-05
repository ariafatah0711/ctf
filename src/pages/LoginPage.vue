<template>
    <Navbar class="w-full" />

    <div class="min-h-screen flex items-center justify-center px-2">
      <LoginForm />
    </div>
</template>
  
<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import LoginForm from '../components/Auth/LoginForm.vue';
</script>