<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  rows?: Array<any>
  selected?: string[]  // UUID list
  loading?: boolean
}>(), {
  rows: () => [],
  selected: () => [],
  loading: false,
})

const emit = defineEmits<{
  (e: 'edit', row: any): void
  (e: 'delete', id: number): void
  (e: 'update:selected', selected: number[]): void
}>()

const lastSelectedIndex = ref<number | null>(null)
const selected = ref<string[]>([]) 
const internalSelected = ref<string[]>([...(props.selected ?? [])])

watch(() => props.selected, (val) => {
  internalSelected.value = [...(val ?? [])]
})

const toggleSelect = (row: any, event?: MouseEvent) => {
  const id = row.id
  const index = props.rows.findIndex(r => r.id === id)

  if (event?.shiftKey && lastSelectedIndex.value !== null) {
    const [start, end] = [lastSelectedIndex.value, index].sort((a, b) => a - b)
    const range = props.rows.slice(start, end + 1).map(r => r.id)
    const merged = new Set([...internalSelected.value, ...range])
    internalSelected.value = [...merged]
  } else if (event?.ctrlKey || event?.metaKey) {
    if (internalSelected.value.includes(id)) {
      internalSelected.value = internalSelected.value.filter(i => i !== id)
    } else {
      internalSelected.value.push(id)
    }
  } else {
    if (internalSelected.value.length === 1 && internalSelected.value[0] === id) {
      internalSelected.value = []
    } else {
      internalSelected.value = [id]
    }
  }

  lastSelectedIndex.value = index
  emit('update:selected', internalSelected.value)
}

const allSelected = computed(() => internalSelected.value.length === props.rows.length)
const toggleSelectAll = () => {
  if (allSelected.value) {
    internalSelected.value = []
  } else {
    internalSelected.value = props.rows.map((r) => r.id)
  }
  emit('update:selected', internalSelected.value)
}

const levelMap = {
  1: 'Easy 🟢',
  2: 'Medium 🟡',
  3: 'Hard 🔴'
}
</script>

<template>
  <div class="mt-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <table class="min-w-[800px] w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
      <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th class="px-2.5 py-2 text-center w-10">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
          </th>
          <th class="px-3 py-2 text-left">Judul</th>
          <th class="px-3 py-2 text-center">URL / File</th>
          <th class="px-3 py-2 text-center">Reviewed</th>
          <th class="px-3 py-2 text-center">Approved</th>
          <th class="px-3 py-2 text-right w-32">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td colspan="8" class="text-center py-4">Memuat data...</td>
        </tr>
        <tr
  v-for="(row, i) in rows"
  :key="row.id"
  @click="toggleSelect(row, $event)"
  :class="[
    'border-t transition cursor-pointer',
    'border-slate-200 dark:border-slate-700',
    internalSelected.includes(row.id) ? 'bg-blue-50 dark:bg-slate-700/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
  ]"
>
          <td class="text-center px-3 py-2">
            <!-- <input type="checkbox" :checked="internalSelected.includes(i)" @change.stop="toggleSelect(i, $event)" /> -->
            <input
  type="checkbox"
  :checked="internalSelected.includes(row.id)"
  @change.stop="toggleSelect(row, $event)"
/>
          </td>
          <td class="px-3 py-2 text-left truncate">{{ row.title }}</td>
          <td class="px-3 py-2 text-center">
            <a :href="row.url" target="_blank" class="text-blue-500 underline">Lihat</a>
          </td>

          <!-- DITINJAU -->
          <td class="px-3 py-2 text-center">
            <span
              :class="{
                'text-green-600 font-semibold': row.reviewed,
                'text-gray-500': !row.reviewed
              }"
            >
              {{ row.reviewed ? 'Sudah ditinjau' : 'Belum ditinjau' }}
            </span>
          </td>

          <!-- STATUS PERSETUJUAN -->
          <td class="px-3 py-2 text-center">
            <span
              :class="{
                'text-green-600 font-semibold': row.accepted === true,
                'text-red-600 font-semibold': row.accepted === false,
                'text-yellow-600': row.accepted === null || row.accepted === undefined
              }"
            >
              {{
                row.accepted === true
                  ? 'Disetujui'
                  : row.accepted === false
                  ? 'Ditolak'
                  : 'Menunggu'
              }}
            </span>
          </td>
          <td class="px-3 py-2 text-right space-x-2">
            <button class="text-blue-600 hover:underline text-sm" @click.stop="$emit('edit', row)">Edit</button>
            <button class="text-red-600 hover:underline text-sm" @click.stop="$emit('delete', row.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="!loading && rows.length === 0">
          <td colspan="8" class="text-center py-4">Tidak ada challenge publik.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>