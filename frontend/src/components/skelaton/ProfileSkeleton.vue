<template>
  <div class="space-y-6">
    <!-- Avatar Skeleton -->
    <div class="flex justify-center items-center">
      <div class="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
    </div>

    <!-- Username Skeleton -->
    <div class="text-center">
      <div class="h-6 w-32 bg-gray-300 rounded mx-auto animate-pulse"></div>
      <div class="mt-2 h-4 w-24 bg-gray-300 rounded mx-auto animate-pulse"></div>
    </div>

    <!-- Edit Profile and View History Buttons Skeleton -->
    <div class="mt-4 flex justify-center gap-4"> <!-- Flex center and gap adjusted -->
      <div class="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
      <div class="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
    </div>

    <!-- Profile Details Skeleton -->
    <div class="border-t border-gray-200 dark:border-white/10 pt-4">
      <dl class="divide-y divide-gray-100 dark:divide-white/10">
        <!-- User ID -->
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">User ID</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
            <div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
          </dd>
        </div>

        <!-- Email -->
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Email</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
            <div class="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
          </dd>
        </div>

        <!-- Username -->
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Username</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
            <div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
          </dd>
        </div>

        <!-- Role -->
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Role</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
            <div class="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
          </dd>
        </div>

        <!-- Difficulty Breakdown -->
        <div class="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Difficulty Breakdown</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:flex sm:flex-wrap sm:gap-4 sm:mt-0">
            <div class="flex-1 flex flex-col space-y-2">
              <div class="h-4 w-36 bg-gray-300 rounded animate-pulse"></div>
              <div class="h-2 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>
          </dd>
        </div>

        <!-- Tags Breakdown -->
        <div class="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Tags Breakdown</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:flex sm:flex-wrap sm:gap-4 sm:mt-0">
            <div class="flex-1 flex flex-col space-y-2">
              <div class="h-4 w-36 bg-gray-300 rounded animate-pulse"></div>
              <div class="h-2 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>
          </dd>
        </div>

        <!-- Solved Challenges -->
        <div class="py-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
          <dt class="text-sm font-medium text-gray-900 dark:text-white">Solved Challenges</dt>
          <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:flex sm:flex-wrap sm:gap-4 sm:mt-0">
            <div class="flex-1 flex flex-col space-y-2 rounded-lg shadow-lg">
              <div class="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
              <div class="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileSkeleton',
};
</script>

<style scoped>
/* Skeleton animation */
@keyframes pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.3;
  }
}
.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}
</style>