<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  members: Array<{
    id: string
    name: string
    email: string
    role: string
    lastSignIn: string
    avatar: string
  }>
}>()

const emit = defineEmits<{
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
}>()

const currentPage = ref(1)
const pageSize = 5

const totalPages = computed(() =>
  Math.ceil(props.members.length / pageSize)
)

const paginatedMembers = computed(() =>
  props.members.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="mt-4 w-full overflow-hidden rounded-lg border border-slate-200">
    <table class="w-full">
      <thead class="border-b border-slate-200 bg-slate-100 text-sm font-medium text-slate-600">
        <tr>
          <th class="px-2.5 py-2 text-start">Member</th>
          <th class="px-2.5 py-2 text-start">Role</th>
          <th class="px-2.5 py-2 text-start">Last Sign In</th>
          <th class="px-2.5 py-2 text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(member, i) in paginatedMembers"
          :key="i"
          class="border-b border-slate-200 last:border-0"
        >
          <td class="p-3 flex items-center gap-3">
            <img
              :src="member.avatar"
              class="w-8 h-8 rounded object-cover"
              :alt="member.name"
            />
            <div class="flex flex-col">
              <small>{{ member.name }}</small>
              <small class="opacity-70">{{ member.email }}</small>
            </div>
          </td>
          <td class="p-3">
            <small>{{ member.role }}</small>
          </td>
          <td class="p-3">
            <small>{{ member.lastSignIn }}</small>
          </td>
          <td class="p-3 text-right space-x-2">
            <button
              class="text-blue-600 hover:underline text-sm"
              @click="$emit('edit', i + (currentPage - 1) * pageSize)"
            >
              Edit
            </button>
            <button
              class="text-red-600 hover:underline text-sm"
              @click="$emit('delete', i + (currentPage - 1) * pageSize)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between items-center p-3 text-sm text-slate-600">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="space-x-2">
        <button
          class="px-3 py-1 rounded border text-sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Prev
        </button>
        <button
          class="px-3 py-1 rounded border text-sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>