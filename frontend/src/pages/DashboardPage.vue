<template>
  <div class="w-full flex justify-center">
    <div class="p-4 w-full max-w-screen-xl">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center sm:text-left flex-1 my-4">
          🖥️ Dashboard
        </h1>
        <div class="flex gap-2">
          <router-link
            to="/dashboard/users"
            class="text-blue-600 dark:text-blue-400 hover:underline text-lg px-2"
          >
            Users
          </router-link>
          <router-link
            to="/dashboard/challenges"
            class="text-blue-600 dark:text-blue-400 hover:underline text-lg px-2"
          >
            Challenges
          </router-link>
        </div>
      </div>

      <DashboardSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <!-- User Stats -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm h-full flex flex-col gap-4">
          <!-- Judul -->
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">User Stats</h2>

          <!-- Total Users -->
          <div class="flex items-center justify-between bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg">
            <p class="text-sm font-medium">Total Users</p>
            <p class="text-lg font-semibold">{{ totalUsers }}</p>
          </div>

          <!-- Total Roles -->
          <div class="flex items-center justify-between bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-lg">
            <p class="text-sm font-medium">Total Roles</p>
            <p class="text-lg font-semibold">{{ totalRoles }}</p>
          </div>

          <!-- Distribusi Role -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-1">Users per Role</p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li
                v-for="(count, role) in usersByRole.user_role"
                :key="role"
                class="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-700 dark:text-gray-100"
              >
                <span class="capitalize font-medium">{{ role }}</span>
                <span class="text-sm font-semibold">{{ count }}</span>
              </li>
            </ul>
          </div>

          <div class="flex-grow"></div>

          <!-- Link -->
          <router-link
            to="/dashboard/users"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-3 self-start"
          >
          → View All Users
          </router-link>
        </div>

        <!-- Top Users -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm h-full flex flex-col gap-4">
          <!-- Judul -->
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Top Users</h2>

          <!-- List Top Users -->
          <ul class="flex flex-col gap-2">
            <li
              v-for="(user) in topUsers.slice(0, 5)"
              :key="user.username"
              class="flex justify-between items-center px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-700 dark:text-gray-100"
            >
              <RouterLink
                :to="`/profile/${user.username}`"
                class="font-medium truncate hover:underline"
              >
                {{ user.username }}
              </RouterLink>
              <span class="text-sm font-semibold">{{ user.solved }} solved</span>
            </li>
          </ul>

          <!-- Spacer untuk dorong link ke bawah -->
          <div class="flex-grow"></div>

          <!-- Link ke leaderboard di bawah kiri -->
          <router-link
            to="/leaderboard"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2"
          >
            → View Leaderboard
          </router-link>
        </div>

        <!-- Challenge Stats -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm h-full sm:col-span-2 flex flex-col gap-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Challenge Stats</h2>

          <p class="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            {{ challengeSummary }}
          </p>

          <!-- Summary -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Total Challenges</p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalChallenges }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Active Challenges</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ totalActiveChallenges }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Inactive Challenges</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ totalInactiveChallenges }}</p>
            </div>
          <!-- </div> -->

          <!-- Most & Least Solved Challenges -->
          <!-- <div class="grid grid-cols-1 sm:grid-cols-3 gap-6"> -->
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Total Solved Submissions</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ completedChallenges }}</p>
            </div> 

            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Challenges Solved (Unique)</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ completedChallengesUniq }}</p>
            </div>

            <!-- Most Solved -->
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Most Solved Challenge</p>
              <RouterLink
                :to="`/challenges/${mostSolvedChallenges.challengeId}`"
                class="font-medium text-gray-800 dark:text-white truncate hover:underline"
              >
                {{ mostSolvedChallenges.title }}
                (
                <span class="font-semibold text-blue-600 dark:text-blue-400">
                  {{ mostSolvedChallenges.count }} solved
                </span>
                )
              </RouterLink>
            </div>
          </div>

          <!-- Difficulty Breakdown -->
          <div>
            <p class="text-sm text-gray-500 dark:text-slate-400 mb-1">Difficulty Breakdown:</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RouterLink
                v-for="item in challengesByDifficulty"
                :key="item.level"
                :to="`/challenges?difficulty=${item.level}`"
                class="flex flex-col bg-slate-50 dark:bg-slate-700 px-4 py-3 rounded-lg shadow-sm text-gray-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-150"
              >
                <span class="text-sm font-semibold mb-0.5">{{ item.label }}</span>
                <span class="text-lg font-bold">{{ item.count }}</span>
                <span class="text-xs text-gray-500 dark:text-slate-400">Challenges</span>
              </RouterLink>
            </div>
          </div>

          <!-- View All Link -->
          <router-link
            to="/dashboard/challenges"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2"
          >
            → View All Challenges
          </router-link>
        </div>
      </div>

      <!-- Tags Distribution -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm sm:col-span-2 flex flex-col gap-4 mt-6"
        v-if="!loading"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Tags Distribution</h2>

        <ul class="flex flex-wrap gap-2">
          <router-link
            v-for="item in tagsDistribution"
            :key="item.tag"
            :to="`/challenges?tags=${encodeURIComponent(item.tag)}`"
            class="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:underline"
          >
            {{ item.tag }} ({{ item.count }})
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSWRV from 'swrv'
import { useAuthStore } from '../stores/auth'
import config from '../config'
import DashboardSkeleton from '../components/skelaton/DashboardSkeleton.vue'

const auth = useAuthStore()

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${auth.user.token}` },
  }).then(res => res.json())

const { data, error, isValidating } = useSWRV(
  () => `${config.BASE_URL}/api/stats`, // pakai function biar reactive
  fetcher,
  {
    ttl: 5 * 60 * 1000, // cache 5 menit
    dedupingInterval: 2000, // optional: minimal interval antar fetch
  }
)

const levelMap = {
  1: 'Easy 🟢',
  2: 'Medium 🟡',
  3: 'Hard 🔴',
}

const totalUsers = computed(() => data.value?.totalUsers || 0)
const totalRoles = computed(() => data.value?.usersByRole?.total_role || 0)
const usersByRole = computed(() => data.value?.usersByRole || {})
const totalChallenges = computed(() => data.value?.totalChallenges || 0)

const challengesByDifficulty = computed(() =>
  data.value?.challengesByDifficulty?.map(({ level, count }) => ({
    label: levelMap[level] || `Level ${level}`,
    level,
    count,
  })) || []
)

const totalActiveChallenges = computed(() => data.value?.totalActiveChallenges || 0)
const totalInactiveChallenges = computed(() => data.value?.totalInactiveChallenges || 0)
const completedChallenges = computed(() => data.value?.totalSolvedSubmissions || 0)
const completedChallengesUniq = computed(() => data.value?.uniqueChallengesSolved || 0)
const mostSolvedChallenges = computed(() => data.value?.mostSolvedChallenges || [])
const topUsers = computed(() => data.value?.leaderboard || [])
const tagsDistribution = computed(() => data.value?.tagsDistribution || [])
const challengeSummary = computed(() => data.value?.description?.challengeSummary || 0)
const topChallengeInfo = computed(() => data.value?.description?.topChallengeInfo || 0)
</script>
