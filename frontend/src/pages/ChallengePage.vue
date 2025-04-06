<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4 max-w-screen-xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">🚩 Challenges</h1>
      <div class="flex flex-col md:flex-row m-0">
        <Breadcrumbs />
        <SubmitFlag class="w-full md:w-auto flex-1" />
      </div>
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