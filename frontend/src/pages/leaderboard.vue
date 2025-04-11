<template>
  <div class="p-4 max-w-screen-xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
      🏆 Leaderboard
    </h1>

    <div v-if="loading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
    </div>
    <!-- <LeaderboardSkeleton v-if="loading" /> -->

    <div v-else>
      <div v-if="leaderboard.length > 0" class="flex flex-col">
        <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
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
              <tr
                v-for="user in leaderboard"
                :key="user.user_id"
                class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                :class="{
                  'bg-slate-200 dark:bg-slate-800': isExactUsername(user.username, highlightUsername)
                }"
                @click="goToUser(user.username)"
              >
                <td class="px-4 py-2 text-center font-medium dark:text-white">{{ user.rank }}</td>
                <td class="px-4 py-2 truncate dark:text-white" :title="user.username">{{ user.username }}</td>
                <td class="px-4 py-2 text-center font-semibold dark:text-white">{{ user.solved }}</td>
                <td class="px-4 py-2 text-center font-semibold dark:text-white">{{ user.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @update:page="setPage"
        />
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 mt-10">
        Tidak ada data leaderboard untuk ditampilkan.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Pagination from '../components/Pagination.vue'
import { useLeaderboard } from '../services/useLeaderboard'

const auth = useAuthStore()
const router = useRouter()

const {
  leaderboard,
  page,
  totalPages,
  loading,
  setPage
} = useLeaderboard(1, 25)

const highlightUsername = auth.user?.username || ''
const isExactUsername = (target: string, keyword: string) => {
  if (!keyword) return false
  return target.trim().toLowerCase() === keyword.trim().toLowerCase()
}

const goToUser = (username: string) => {
  router.push(`/profile/${username}`)
}
</script>