<script setup lang="ts">
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
</template>