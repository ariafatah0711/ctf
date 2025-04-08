<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 animate-pulse">
      <!-- User Stats Skeleton -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 h-full">
        <div class="h-6 w-40 bg-gray-300 dark:bg-slate-600 rounded"></div>
        <div class="h-12 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div class="h-12 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div class="grid grid-cols-2 gap-2">
          <div class="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div class="h-4 w-24 bg-gray-300 dark:bg-slate-600 rounded mt-4"></div>
      </div>
  
      <!-- Top Users Skeleton -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 h-full">
        <div class="h-6 w-40 bg-gray-300 dark:bg-slate-600 rounded"></div>
        <div v-for="n in 5" :key="n" class="h-10 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
        <div class="h-4 w-24 bg-gray-300 dark:bg-slate-600 rounded mt-4"></div>
      </div>
  
      <!-- Challenge Stats Skeleton -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 sm:col-span-2 h-full">
        <div class="h-6 w-48 bg-gray-300 dark:bg-slate-600 rounded"></div>
  
        <!-- Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
  
        <!-- Most/Least Solved & Avg -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-12 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
  
        <!-- Difficulty Breakdown -->
        <div>
          <div class="h-4 w-40 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="n in 3" :key="n" class="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
  
        <div class="h-4 w-32 bg-gray-300 dark:bg-slate-600 rounded mt-2"></div>
      </div>
  
      <!-- Tags Distribution -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm sm:col-span-2 flex flex-col gap-4 mt-6">
        <div class="h-6 w-56 bg-gray-300 dark:bg-slate-600 rounded"></div>
        <div class="flex flex-wrap gap-2">
          <div v-for="n in 6" :key="n" class="h-8 w-24 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
        </div>
      </div>
    </div>
</template>