<template>
    <div class="rounded-2xl p-5 h-full shadow border bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 animate-pulse flex flex-col justify-between">
      <!-- Top Section -->
      <div>
        <!-- Title + Badge -->
        <div class="flex justify-between items-start mb-2">
          <div class="h-5 bg-gray-300 dark:bg-slate-600 rounded w-2/3"></div>
          <div class="h-5 w-12 rounded-full bg-gray-300 dark:bg-slate-600"></div>
        </div>
  
        <!-- Description -->
        <!-- <div class="space-y-2 mb-3">
          <div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
          <div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
        </div> -->

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <div class="h-5 w-12 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
          <!-- <div class="h-5 w-16 bg-gray-300 dark:bg-slate-600 rounded-full"></div> -->
        </div>
      </div>
  
      <!-- Bottom Section -->
      <div class="flex justify-between items-center text-xs">
        <div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/3"></div>
        <div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/4"></div>
      </div>
    </div>
</template>