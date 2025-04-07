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

      <div v-if="loading" class="text-gray-500 dark:text-gray-400">Loading...</div>

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
            View All Users → 
          </router-link>
        </div>

        <!-- Top Users -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm h-full flex flex-col gap-4">
          <!-- Judul -->
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Top Users</h2>

          <!-- List Top Users -->
          <ul class="flex flex-col gap-2">
            <li
              v-for="(user, index) in topUsers.slice(0, 5)"
              :key="user.username"
              class="flex justify-between items-center px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-gray-700 dark:text-gray-100"
            >
              <span class="font-medium truncate">{{ user.username }}</span>
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

          <!-- Summary -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Total Challenges</p>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalChallenges }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Challenges Solved (Unique)</p>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ completedChallengesUniq }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Total Solved Submissions</p>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ completedChallenges }}</p>
            </div>
          </div>

          <!-- Most & Least Solved Challenges -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <!-- Most Solved -->
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Most Solved Challenge</p>
              <p class="font-medium text-gray-800 dark:text-white truncate">
                {{ mostSolvedChallenges.title }} (
                <span class="font-semibold text-blue-600 dark:text-blue-400">{{ mostSolvedChallenges.count }} solved</span> )
              </p>
            </div>

            <!-- Least Solved -->
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Least Solved Challenge</p>
              <p class="font-medium text-gray-800 dark:text-white truncate">-</p>
            </div>

            <!-- Average Solve Time -->
            <div>
              <p class="text-sm text-gray-500 dark:text-slate-400">Average Solve Time</p>
              <p class="font-medium text-gray-800 dark:text-white truncate">
                -
              </p>
            </div>
          </div>

          <!-- Difficulty Breakdown -->
          <div>
            <p class="text-sm text-gray-500 dark:text-slate-400 mb-1">Difficulty Breakdown:</p>
            <ul class="grid grid-cols-2 sm:grid-cols-4 gap-y-1 text-sm text-gray-700 dark:text-slate-300">
              <li
                v-for="(count, diff) in challengesByDifficulty"
                :key="diff"
                class="flex items-center justify-between border-b border-gray-200 dark:border-slate-600 py-1 pr-2"
              >
                <span class="text-sm">Difficulty {{ diff }}</span>
                <span class="font-medium">{{ count }}</span>
              </li>
            </ul>
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
          <li
            v-for="item in tagsDistribution"
            :key="item.tag"
            class="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          >
            {{ item.tag }} ({{ item.count }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import config from '../config'
import Navbar from '../components/Navbar.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const auth = useAuthStore()
const loading = ref(true)

const totalUsers = ref(0)
const totalRoles = ref(0)
const usersByRole = ref<Record<string, number>>({})
const totalChallenges = ref(0)
const challengesByDifficulty = ref<Record<string, number>>({})
const completedChallenges = ref(0)
const completedChallengesUniq = ref(0)
const topUsers = ref<any[]>([])
const mostSolvedChallenges = ref<{ challengeId: string; count: number; title: string }[]>([]);
const tagsDistribution = ref<{ tag: string; count: number }[]>([])

const levelMap = {
  1: 'Easy 🟢',
  2: 'Medium 🟡',
  3: 'Hard 🔴'
}

const fetchDashboardStats = async () => {
  try {
    const res = await fetch(`${config.BASE_URL}/api/stats`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    const data = await res.json()
    // console.log(data)

    totalUsers.value = data.totalUsers || 0
    totalRoles.value = data.usersByRole.total_role || 0
    usersByRole.value = data.usersByRole || {}
    totalChallenges.value = data.totalChallenges || 0
    challengesByDifficulty.value = data.challengesByDifficulty?.reduce((acc, { level, count }) => {
      acc[levelMap[level] || `Level ${level}`] = count;
      return acc;
    }, {}) || {};
    completedChallenges.value = data.totalSolvedSubmissions || 0
    mostSolvedChallenges.value = data.mostSolvedChallenges || []
    completedChallengesUniq.value = data.uniqueChallengesSolved || 0
    topUsers.value = data.leaderboard || []
    tagsDistribution.value = data.tagsDistribution || []

    loading.value = false
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>