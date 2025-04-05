<script setup lang="ts">
  import Navbar from '../components/Navbar.vue';
  import SubmitFlag from '../components/SubmitFlag.vue';
  import ChallengeList from '../components/ChallengeList.vue';
</script>

<template>
  <Navbar />

  <div class="p-4 space-y-8">
    <SubmitFlag />
    <div>
      <h1 class="text-2xl font-bold mb-4 text-amber-700">🧠 Daftar Tantangan</h1>
      <ChallengeList />
    </div>
  </div>
</template>
