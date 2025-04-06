<script setup lang="ts">
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

// const emit = defineEmits<{
//   (e: 'edit', index: number): void
//   (e: 'delete', index: number): void
// }>()
</script>

<!-- <template>
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
          v-for="(member, i) in props.members"
          :key="member.id"
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
              @click="$emit('edit', i)"
            >
              Edit
            </button>
            <button
              class="text-red-600 hover:underline text-sm"
              @click="$emit('delete', i)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template> -->

<template>
  <div class="mt-4 w-full overflow-x-auto rounded-lg border border-slate-200">
    <table class="min-w-[600px] w-full">
      <thead class="border-b border-slate-200 bg-slate-100 text-sm font-medium text-slate-600">
        <tr>
          <th class="px-2.5 py-2 text-left whitespace-nowrap">Member</th>
          <th class="px-2.5 py-2 text-left whitespace-nowrap">Role</th>
          <th class="px-2.5 py-2 text-left whitespace-nowrap">Last Sign In</th>
          <th class="px-2.5 py-2 text-right whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(member, i) in props.members"
          :key="member.id"
          class="border-b border-slate-200 last:border-0"
        >
          <td class="p-3 flex items-center gap-3">
            <img
              :src="member.avatar"
              class="w-8 h-8 rounded object-cover"
              :alt="member.name"
            />
            <div class="flex flex-col">
              <small class="font-medium">{{ member.name }}</small>
              <small class="text-slate-500">{{ member.email }}</small>
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
              @click="$emit('edit', i)"
            >
              Edit
            </button>
            <button
              class="text-red-600 hover:underline text-sm"
              @click="$emit('delete', i)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>