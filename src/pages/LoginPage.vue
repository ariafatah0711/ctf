<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

    <div class="flex items-center justify-center px-2">
      <LoginForm />
    </div>
</template>
  
<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import LoginForm from '../components/Auth/LoginForm.vue';
</script>