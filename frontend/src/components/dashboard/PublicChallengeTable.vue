<!-- components/PublicChallengeTable.vue -->
<script setup lang="ts">
import { ref, watch, computed } from "vue"

const props = defineProps<{
  rows: Array<{
    id: number
    title: string
    username: string
    reviewed: boolean
    accepted: boolean
  }>
  selected: number[]
}>()

const emit = defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'view', row: any): void
  (e: 'toggleReview', id: number): void
  (e: 'toggleApprove', id: number): void
  (e: 'update:selected', selected: number[]): void
}>()

const internalSelected = ref<number[]>([...(props.selected ?? [])])
watch(() => props.selected, val => {
  internalSelected.value = [...(val ?? [])]
})

const toggleSelect = (id: number) => {
  if (internalSelected.value.includes(id)) {
    internalSelected.value = internalSelected.value.filter(i => i !== id)
  } else {
    internalSelected.value.push(id)
  }
  emit('update:selected', internalSelected.value)
}

const isAllSelected = computed(() =>
  props.rows.length > 0 && props.rows.every(r => internalSelected.value.includes(r.id))
)

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    internalSelected.value = []
  } else {
    internalSelected.value = props.rows.map(r => r.id)
  }
  emit('update:selected', internalSelected.value)
}
</script>

<template>
  <div class="mt-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <table class="min-w-[800px] w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
      <colgroup>
        <col style="width: 40px;" />
        <col style="width: 35%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 10%;" />
        <col style="width: 45%;" />
      </colgroup>
      <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th class="px-2.5 py-2 text-center">#</th>
          <th class="px-2.5 py-2 text-left">Judul</th>
          <th class="px-2.5 py-2 text-left">Username</th>
          <th class="px-2.5 py-2 text-center">Tinjau</th>
          <th class="px-2.5 py-2 text-center">Setujui</th>
          <th class="px-2.5 py-2 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in props.rows"
          :key="row.id"
          @click="toggleSelect(row.id)"
          :class="[ 
            'border-t transition cursor-pointer', 
            'border-slate-200 dark:border-slate-700', 
            internalSelected.includes(row.id) ? 'bg-blue-50 dark:bg-slate-700/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          <td class="p-3 text-center">
            <input type="checkbox" :checked="internalSelected.includes(row.id)" @change.stop="toggleSelect(row.id)" />
          </td>
          <td class="p-3 text-left truncate text-xs text-slate-700 dark:text-white">
            <small class="font-medium">{{ row.title }}</small>
          </td>
          <td class="p-3 text-left truncate text-xs text-slate-700 dark:text-white">
            <small class="font-medium">{{ row.username }}</small>
          </td>
          <td class="p-3 text-center text-xs">
            <span :class="row.reviewed ? 'text-green-600' : 'text-gray-500'">
              {{ row.reviewed ? '✓' : '✗' }}
            </span>
          </td>
          <td class="p-3 text-center text-xs">
            <span :class="row.accepted ? 'text-green-600' : 'text-gray-500'">
              {{ row.accepted ? '✓' : '✗' }}
            </span>
          </td>
          <td class="p-3 text-right">
            <div class="flex justify-end items-center gap-2 flex-wrap">
              <button
                class="text-blue-600 hover:underline dark:text-blue-400 text-xs"
                @click.stop="$emit('view', row)"
              >Lihat</button>
              <button
                class="text-yellow-600 hover:underline dark:text-yellow-400 text-xs"
                @click.stop="$emit('toggleReview', row.id)"
              >
                {{ row.reviewed ? 'Batal Tinjau' : 'Tinjau' }}
              </button>
              <button
                class="text-green-600 hover:underline dark:text-green-400 text-xs"
                @click.stop="$emit('toggleApprove', row.id)"
              >
                {{ row.accepted ? 'Batal Setujui' : 'Setujui' }}
              </button>
              <button
                class="text-red-600 hover:underline dark:text-red-400 text-xs"
                @click.stop="$emit('delete', row.id)"
              >Hapus</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
tr {
  user-select: none;
}
td {
  user-select: none;
}
</style>