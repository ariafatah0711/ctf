<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4 max-w-screen-xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
      <h1 class="text-2xl font-bold text-blue-600 text-center sm:text-left flex-1 my-4">🖥️ Dashboard</h1>
      <div>
        <router-link to="/dashboard/users" class="text-blue-500 hover:underline text-lg w-full sm:w-auto px-2">User Dashboard</router-link>
        <router-link to="/dashboard/challenges" class="text-blue-500 hover:underline text-lg w-full sm:w-auto px-2">Challenges</router-link>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch" v-if="!loading">
      <!-- User Stats -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">👥 User Stats</h2>
        <p class="text-gray-700 mb-1">Total Users: <strong>{{ totalUsers }}</strong></p>
        <p class="text-gray-700 mb-1">Total Role: <strong>{{ totalRoles }}</strong></p>

        <ul class="space-y-1 flex-grow ml-6"> <!-- Menambahkan margin left (ml-6) untuk indentasi -->
          <li v-for="(count, role) in usersByRole.user_role" :key="role" class="text-gray-600">
            {{ role }}: <strong>{{ count }}</strong>
          </li>
        </ul>
        <router-link to="/dashboard/users" class="text-blue-500 hover:underline mt-4 inline-block">View All Users →</router-link>
      </div>

      <!-- Top Users -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">🏆 Top Users</h2>
        <ul class="space-y-1">
          <li v-for="user in topUsers.slice(0, 5)" :key="user.username" class="text-gray-700">
            {{ user.username }} - <strong>{{ user.solved }}</strong> solved
          </li>
        </ul>
        <router-link to="/leaderboard" class="text-blue-500 hover:underline mt-4 inline-block">View Leaderboard →</router-link>
      </div>

      <!-- Challenge Stats -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full col-span-1 sm:col-span-2 flex flex-col">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">🎯 Challenge Stats</h2>

        <p class="text-gray-700 mb-3">Total Challenges: <strong>{{ totalChallenges }}</strong></p>
        <p class="text-gray-700 mb-3">Challenges Solved: <strong>{{ completedChallengesUniq }}</strong></p>
        <p class="text-gray-700 mb-3">Completed: <strong>{{ completedChallenges }}</strong></p>

        <!-- Most Solved Challenges -->
        <div class="mb-3">
          <p class="text-gray-700">Most Solved Challenges:</p>
          <p class="text-gray-700">
            <strong>{{ mostSolvedChallenges.title }}</strong> - <strong>{{ mostSolvedChallenges.count }}</strong> solved
          </p>
        </div>

        <!-- Difficulty Breakdown -->
        <ul class="space-y-2 mb-3">
          <li v-for="(count, diff) in challengesByDifficulty" :key="diff" class="text-gray-600">
            Difficulty {{ diff }}: <strong>{{ count }}</strong>
          </li>
        </ul>

        <!-- View All Challenges Link -->
        <div class="mt-auto">
          <router-link to="/dashboard/challenges" class="text-blue-500 hover:underline mt-4 inline-block">View All Challenges →</router-link>
        </div>
      </div>
    </div>

    <!-- Tags Distribution -->
    <div class="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm" v-if="!loading">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">🏷️ Tags Distribution</h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="item in tagsDistribution" :key="item.tag"
            class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {{ item.tag }} ({{ item.count }})
        </li>
      </ul>
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
    console.log(data)

    totalUsers.value = data.totalUsers || 0
    totalRoles.value = data.usersByRole.total_role || 0
    usersByRole.value = data.usersByRole || {}
    totalChallenges.value = data.totalChallenges || 0
    challengesByDifficulty.value = data.challengesByDifficulty?.reduce((acc, { level, count }) => {
      // Mengonversi level menjadi nama yang lebih deskriptif
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

<style scoped>
</style>