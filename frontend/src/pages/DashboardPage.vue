<template class="min-h-screen">
    <Navbar />
    <div class="h-16"></div>
  
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6 text-blue-600">🛠️ Admin Dashboard</h1>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- User Stats -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">User Stats</h2>
          <p>Total Users: {{ totalUsers }}</p>
          <p>Active Users: {{ activeUsers }}</p>
          <router-link to="/admin/users" class="text-blue-500 hover:underline mt-4 inline-block">View All Users</router-link>
        </div>
  
        <!-- Challenge Stats -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Challenge Stats</h2>
          <p>Total Challenges: {{ totalChallenges }}</p>
          <p>Completed Challenges: {{ completedChallenges }}</p>
          <router-link to="/admin/challenges" class="text-blue-500 hover:underline mt-4 inline-block">View All Challenges</router-link>
        </div>
  
        <!-- Recent Activities -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-bold mb-4">Recent Activities</h2>
          <ul>
            <li v-for="activity in recentActivities" :key="activity.id">{{ activity.message }}</li>
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
  
    const auth = useAuthStore()
  
    const totalUsers = ref(0)
    const activeUsers = ref(0)
    const totalChallenges = ref(0)
    const completedChallenges = ref(0)
    const recentActivities = ref<any[]>([])
  
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch(`${config.BASE_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        const data = await res.json()
        totalUsers.value = data.totalUsers
        activeUsers.value = data.activeUsers
        totalChallenges.value = data.totalChallenges
        completedChallenges.value = data.completedChallenges
        recentActivities.value = data.recentActivities
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }
  
    onMounted(() => {
      fetchDashboardStats()
    })
</script>