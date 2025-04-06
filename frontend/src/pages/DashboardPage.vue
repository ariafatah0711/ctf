<template class="min-h-screen">
  <Navbar />
  <div class="h-16"></div>

  <div class="p-4 max-w-screen-xl mx-auto">
    <h1 class="text-3xl font-bold text-blue-600 text-center sm:text-left mb-6">🖥️ Admin Dashboard</h1>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      <!-- User Stats -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full flex flex-col">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">👥 User Stats</h2>
        <p class="text-gray-700 mb-1">Total Users: <strong>{{ totalUsers }}</strong></p>
        <ul class="space-y-1 flex-grow">
          <li v-for="(count, role) in usersByRole" :key="role" class="text-gray-600">
            {{ role }}: <strong>{{ count }}</strong>
          </li>
        </ul>
        <router-link to="/admin/users" class="text-blue-500 hover:underline mt-4 inline-block">View All Users →</router-link>
      </div>

      <!-- Top Users -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">🏆 Top Users</h2>
        <ul class="space-y-1">
          <li v-for="user in topUsers.slice(0, 3)" :key="user.username" class="text-gray-700">
            {{ user.username }} - <strong>{{ user.solved }}</strong> solved
          </li>
        </ul>
      </div>

      <!-- Challenge Stats -->
      <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-full col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">🎯 Challenge Stats</h2>
        <p class="text-gray-700 mb-1">Total Challenges: <strong>{{ totalChallenges }}</strong></p>
        <p class="text-gray-700 mb-3">Completed: <strong>{{ completedChallenges }}</strong></p>
        <ul class="space-y-1">
          <div v-for="(count, diff) in challengesByDifficulty" :key="diff" class="text-gray-600">
            Difficulty {{ diff }}: <strong>{{ count }}</strong>
          </div>
        </ul>
        <!-- Place View All Challenges at the bottom -->
        <div class="mt-auto">
          <router-link to="/admin/challenges" class="text-blue-500 hover:underline mt-4 inline-block">View All Challenges →</router-link>
        </div>
      </div>
    </div>

    <!-- Tags Distribution -->
    <div class="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
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

const totalUsers = ref(0)
const usersByRole = ref<Record<string, number>>({})
const totalChallenges = ref(0)
const challengesByDifficulty = ref<Record<string, number>>({})
const completedChallenges = ref(0)
const topUsers = ref<any[]>([])
const tagsDistribution = ref<{ tag: string; count: number }[]>([])

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
    usersByRole.value = data.usersByRole || {}
    totalChallenges.value = data.totalChallenges || 0
    challengesByDifficulty.value = data.challengesByDifficulty?.reduce((acc, { level, count }) => {
      acc[`${level}`] = count;
      return acc;
    }, {}) || {};
    completedChallenges.value = data.totalSolvedSubmissions || 0
    topUsers.value = data.leaderboard || []
    tagsDistribution.value = data.tagsDistribution || []
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<style scoped>
</style>