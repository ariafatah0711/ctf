<template>
    <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
      <table class="w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
        <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
          <tr>
            <th class="w-[60px] px-4 py-2 text-center">Rank</th>
            <th class="px-4 py-2 text-left">Username</th>
            <th class="w-[80px] px-4 py-2 text-center">Solved</th>
            <th class="w-[80px] px-4 py-2 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 10" :key="n" class="border-t border-slate-200 dark:border-slate-700">
            <td class="px-4 py-3 text-center">
              <div class="h-4 w-6 bg-gray-200 dark:bg-slate-700 mx-auto rounded"></div>
            </td>
            <td class="px-4 py-3">
              <div class="h-4 w-40 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="h-4 w-6 bg-gray-200 dark:bg-slate-700 mx-auto rounded"></div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="h-4 w-10 bg-gray-200 dark:bg-slate-700 mx-auto rounded"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>  