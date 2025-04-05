<template>
    <Navbar class="w-full" />

    <div class="min-h-screen flex items-center justify-center px-2">
      <RegisterForm />
    </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import RegisterForm from '../components/Auth/RegisterForm.vue';

// const onSubmit = async () => {
//   try {
//     await authService.register(username.value, email.value, password.value);
//     router.push('/login'); // Redirect ke login setelah sukses
//   } catch (err: any) {
//     error.value = err.message;
//   }
// };
</script>
