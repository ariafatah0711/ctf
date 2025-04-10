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

const allSelected = computed(() =>
  props.rows.length > 0 &&
  props.rows.every(row => internalSelected.value.includes(row.id))
)

const toggleSelectAll = () => {
  if (allSelected.value) {
    internalSelected.value = []
  } else {
    internalSelected.value = props.rows.map(row => row.id)
  }
  emit('update:selected', internalSelected.value)
}

const lastSelectedIndex = ref<number | null>(null)

const toggleSelect = (index: number, event?: MouseEvent) => {
  const id = props.rows[index].id

  if (event?.shiftKey && lastSelectedIndex.value !== null) {
    const [start, end] = [lastSelectedIndex.value, index].sort((a, b) => a - b)
    const idsInRange = props.rows.slice(start, end + 1).map(r => r.id)
    const merged = new Set([...internalSelected.value, ...idsInRange])
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

watch(() => props.rows, () => {
  internalSelected.value = []
  lastSelectedIndex.value = null
})
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
          <th class="px-2.5 py-2 text-center w-10">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
          </th>
          <th class="px-2.5 py-2 text-left">Judul</th>
          <th class="px-2.5 py-2 text-left">Username</th>
          <th class="px-2.5 py-2 text-center">Tinjau</th>
          <th class="px-2.5 py-2 text-center">Setujui</th>
          <th class="px-2.5 py-2 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in props.rows"
          :key="row.id"
          @click="toggleSelect(index, $event)"
          :class="[ 
            'border-t transition cursor-pointer', 
            'border-slate-200 dark:border-slate-700', 
            internalSelected.includes(row.id) ? 'bg-blue-50 dark:bg-slate-700/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          <td class="p-3 text-center">
            <!-- <input type="checkbox" :checked="internalSelected.includes(row.id)" @change.stop="toggleSelect(row.id)" /> -->
            <input
              type="checkbox"
              :checked="internalSelected.includes(row.id)"
              @change.stop="toggleSelect(index, $event)"
            />
          </td>
          <td class="p-3 text-left truncate text-sm text-slate-700 dark:text-white">
            <small class="font-medium">{{ row.title }}</small>
          </td>
          <td class="p-3 text-left truncate text-sm text-slate-700 dark:text-white">
            <small class="font-medium">{{ row.username }}</small>
          </td>
          <td class="p-3 text-center text-sm">
            <span :class="row.reviewed ? 'text-green-600' : 'text-gray-500'">
              {{ row.reviewed ? '✓' : '✗' }}
            </span>
          </td>
          <td class="p-3 text-center text-sm">
            <span :class="row.accepted ? 'text-green-600' : 'text-gray-500'">
              {{ row.accepted ? '✓' : '✗' }}
            </span>
          </td>
          <td class="p-3 text-right">
            <div class="flex justify-end items-center gap-2 flex-wrap">
              <button
                class="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                @click.stop="$emit('view', row)"
              >Lihat</button>
              <button
                class="text-yellow-600 hover:underline dark:text-yellow-400 text-sm"
                @click.stop="$emit('toggleReview', row.id)"
              >
                {{ row.reviewed ? 'Batal Tinjau' : 'Tinjau' }}
              </button>
              <template v-if="row.accepted === null">
                  <button
                    class="text-green-600 hover:underline dark:text-green-400 text-sm"
                    @click.stop="$emit('toggleApprove', row.id, 'setujui')"
                  >Setujui</button>

                  <button
                    class="text-red-600 hover:underline dark:text-red-400 text-sm"
                    @click.stop="$emit('toggleApprove', row.id, 'tolak')"
                  >Tolak</button>
                </template>

                <template v-else>
                  <button
                    class="text-gray-600 hover:underline dark:text-gray-400 text-sm"
                    @click.stop="$emit('toggleApprove', row.id, 'batalkan')"
                  >Batalkan</button>
                </template>
              <button
                class="text-red-600 hover:underline dark:text-red-400 text-sm"
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