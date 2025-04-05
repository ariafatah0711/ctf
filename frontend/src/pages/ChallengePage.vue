<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4 space-y-8">
    <div class="flex">
      <Breadcrumbs />
      <SubmitFlag class="w-full" />
    </div>
    <div>
      <h1 class="text-2xl font-bold mb-4 text-amber-700">🧠 Daftar Tantangan</h1>
      <ChallengeList />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import SubmitFlag from '../components/SubmitFlag.vue';
  import ChallengeList from '../components/ChallengeList.vue';
  import Breadcrumbs from "../components/Breadcrumbs.vue"
</script>