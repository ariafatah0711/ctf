<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  rows?: Array<any>
  selected?: number[]
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

const internalSelected = ref<number[]>([...(props.selected ?? [])])
const lastSelectedIndex = ref<number | null>(null)

watch(() => props.selected, (val) => {
  internalSelected.value = [...(val ?? [])]
})

const toggleSelect = (index: number, event?: MouseEvent) => {
  if (event?.shiftKey && lastSelectedIndex.value !== null) {
    const [start, end] = [lastSelectedIndex.value, index].sort((a, b) => a - b)
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    const merged = new Set([...internalSelected.value, ...range])
    internalSelected.value = [...merged]
  } else if (event?.ctrlKey || event?.metaKey) {
    if (internalSelected.value.includes(index)) {
      internalSelected.value = internalSelected.value.filter(i => i !== index)
    } else {
      internalSelected.value.push(index)
    }
  } else {
    if (internalSelected.value.length === 1 && internalSelected.value[0] === index) {
      internalSelected.value = []
    } else {
      internalSelected.value = [index]
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
    internalSelected.value = props.rows.map((_, i) => i)
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
          @click="toggleSelect(i, $event)"
          :class="[
            'border-t transition cursor-pointer',
            'border-slate-200 dark:border-slate-700',
            internalSelected.includes(i) ? 'bg-blue-50 dark:bg-slate-700/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          <td class="text-center px-3 py-2">
            <input type="checkbox" :checked="internalSelected.includes(i)" @change.stop="toggleSelect(i, $event)" />
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