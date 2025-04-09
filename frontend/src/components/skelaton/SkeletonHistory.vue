<template>
    <div class="space-y-4 animate-pulse">
      <div
        v-for="n in 5"
        :key="n"
        class="border-b border-gray-300 dark:border-slate-600 py-2"
      >
        <div class="flex flex-col sm:flex-row sm:items-baseline sm:gap-x-1 space-y-2 sm:space-y-0">
          <div class="flex gap-x-2 flex-wrap items-center">
            <div class="h-4 w-32 bg-gray-300 dark:bg-slate-600 rounded"></div>
            <div class="h-4 w-4 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div class="h-4 w-24 bg-gray-300 dark:bg-slate-600 rounded"></div>
          </div>
          <div class="flex gap-x-2 flex-wrap items-center">
            <div class="h-4 w-20 bg-gray-300 dark:bg-slate-600 rounded"></div>
            <div class="h-4 w-36 bg-gray-300 dark:bg-slate-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
</template>