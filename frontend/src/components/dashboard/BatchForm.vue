<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center sm:scale-100 scale-90">
      <div class="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl p-6 shadow-xl space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ title }}
          </h2>
          <button @click="onCancel" class="text-gray-500 hover:text-red-500 text-2xl font-bold">×</button>
        </div>
  
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Masukkan data (format CSV)
          </label>
          <textarea
            v-model="csvInput"
            :placeholder="placeholder"
            rows="10"
            class="w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
  
        <div class="flex justify-end gap-3 pt-2">
          <button @click="onCancel" class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl">
            Batal
          </button>
          <button @click="parseCSV" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Submit
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { swalError } from '../../utills/swalAlert'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Batch Form',
  },
  placeholder: {
    type: String,
    default: '',
  },
  fields: {
    // contoh: ['name', 'email', 'password', 'role']
    type: Array,
    required: true,
  },
  transform: {
    // fungsi opsional buat parsing lebih kompleks (misal tags, difficulty, dsb)
    type: Function,
    default: null,
  }
})

const emit = defineEmits(['cancel', 'submit'])
const csvInput = ref('')

const onCancel = () => {
  emit('cancel')
  csvInput.value = ''
}

const parseCSV = () => {
  const lines = csvInput.value.split('\n').map(l => l.trim()).filter(Boolean)
  const data = []

  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim())

    if (parts.length < props.fields.length) {
      swalError(`Baris tidak valid (kurang field): "${line}`)
      return
    }

    const entry = {}
    props.fields.forEach((field, i) => {
      entry[field] = parts[i] ?? ''
    })

    // jika ada fungsi transform, pakai
    const finalEntry = props.transform ? props.transform(entry, line) : entry

    if (finalEntry === false) return // bisa pakai false untuk menolak baris

    data.push(finalEntry)
  }

  emit('submit', data)
  csvInput.value = ''
}
</script>