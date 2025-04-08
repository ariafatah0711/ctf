<template>
    <div class="w-full flex justify-center">
      <div class="p-4 w-full max-w-screen-md mx-auto animate-pulse">
        <div class="flex flex-col items-center space-y-4 mb-6">
          <!-- Avatar -->
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 shadow-lg ring-2 ring-blue-300"></div>
  
          <!-- Username & Role -->
          <div class="text-center space-y-2">
            <div class="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div class="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded mx-auto"></div>
          </div>
        </div>
  
        <!-- Detail Info -->
        <div class="border-t border-gray-200 dark:border-white/10 pt-4 space-y-4">
          <div v-for="i in 4" :key="i" class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <div class="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded mb-2 sm:mb-0"></div>
            <div class="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
</template>  