<template>
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-xl">
      <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">🚩 Challenges</h1>
      
      <div class="flex flex-col md:flex-row gap-4 pb-6">
        <Breadcrumbs class="w-full sm:w-auto flex-1" :extra-items="[{ name: 'Upload', href: '/challenges/upload' }]" />
        <SubmitFlag class="w-full md:w-auto flex-1" />
      </div>
      
      <ChallengeList />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SubmitFlag from '../components/SubmitFlag.vue';
  import ChallengeList from '../components/ChallengeList.vue';
  import Breadcrumbs from "../components/Breadcrumbs.vue"
</script>