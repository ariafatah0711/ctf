<!-- <script setup lang="ts">
const props = defineProps<{
  columns: Array<{
    label: string
    key: string
    grow?: boolean
    class?: string
  }>
  rows: Array<Record<string, any>>
}>()

const emit = defineEmits<{
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
}>()
</script>

<template>
  <div class="mt-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <table class="min-w-[600px] w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
      <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
        <tr>
          <th
            v-for="(col, index) in columns"
            :key="col.key"
            :class="[
              'px-2.5 py-2 whitespace-nowrap',
              col.class,
              index === 0 ? 'text-left' : 'text-center',
              col.grow ? 'w-auto' : (col.width ?? 'w-15')
            ]"
          >
            {{ col.label }}
          </th>
          <th class="px-2.5 py-2 text-right whitespace-nowrap w-30">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.id"
          class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <td
            v-for="(col, index) in columns"
            :key="col.key"
            :class="[
              'p-3 whitespace-nowrap truncate text-sm text-slate-700 dark:text-white',
              col.class,
              index === 0 ? 'text-left' : 'text-center',
              col.grow ? 'w-auto' : (col.width ?? 'w-15')
            ]"
          >
            <slot :name="col.key" :row="row">
              <small>{{ row[col.key] }}</small>
            </slot>
          </td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600 hover:underline dark:text-blue-400 text-sm" @click="$emit('edit', i)">
              Edit
            </button>
            <button class="text-red-600 hover:underline dark:text-red-400 text-sm" @click="$emit('delete', i)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template> -->

<script setup lang="ts">
import { ref, watch, computed } from "vue"
const props = defineProps<{
  columns: Array<{
    label: string
    key: string
    grow?: boolean
    class?: string
  }>
  rows: Array<Record<string, any>>
  selected: number[], // <-- Tambahkan ini
  minWidth?: string
}>()

const emit = defineEmits<{
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
  (e: 'update:selected', selected: number[]): void // <-- ganti jadi ini
}>()

const minWidth = props.minWidth || '600px'
const internalSelected = ref<number[]>([...(props.selected ?? [])])

watch(() => props.selected, (val) => {
  internalSelected.value = [...(val ?? [])]
})

const toggleSelect = (index: number) => {
  if (internalSelected.value.includes(index)) {
    internalSelected.value = internalSelected.value.filter(i => i !== index)
  } else {
    internalSelected.value.push(index)
  }
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
</script>

<template>
  <div :style="{ minWidth }" class="mt-4 w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
    <table :class="`min-w-[${minWidth}] w-full table-fixed border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden`">
      <thead class="bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
        <tr>
          <!-- Checkbox header -->
          <th class="px-2.5 py-2 text-center w-10">
            <!-- <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" /> -->
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
          </th>

          <th
            v-for="(col, index) in columns"
            :key="col.key"
            :class="[
              'px-2.5 py-2 whitespace-nowrap',
              col.class,
              index === 0 ? 'text-left' : 'text-center',
              col.grow ? 'w-auto' : (col.width ?? 'w-15')
            ]"
          >
            {{ col.label }}
          </th>
          <th class="px-2.5 py-2 text-right whitespace-nowrap w-30">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.id"
          class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <!-- Checkbox cell -->
          <td class="p-3 text-center">
            <input type="checkbox" :checked="internalSelected.includes(i)" @change="toggleSelect(i)" />
          </td>

          <td
            v-for="(col, index) in columns"
            :key="col.key"
            :class="[
              'p-3 whitespace-nowrap truncate text-sm text-slate-700 dark:text-white',
              col.class,
              index === 0 ? 'text-left' : 'text-center',
              col.grow ? 'w-auto' : (col.width ?? 'w-15')
            ]"
          >
            <slot :name="col.key" :row="row">
              <small>{{ row[col.key] }}</small>
            </slot>
          </td>
          <td class="p-3 text-right space-x-2">
            <button class="text-blue-600 hover:underline dark:text-blue-400 text-sm" @click="$emit('edit', i)">
              Edit
            </button>
            <button class="text-red-600 hover:underline dark:text-red-400 text-sm" @click="$emit('delete', i)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>