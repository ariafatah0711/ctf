<template>
  <div class="w-full sm:max-w-3xl sm:min-w-[500px] min-w-full mx-auto sm:scale-100 scale-90 sm:max-h-none sm:overflow-visible max-h-[90vh] overflow-y-auto">
    <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 space-y-6">
      <h2 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {{ formType === 'add' ? '➕ Tambah Challenge Baru' : '✏️ Edit Challenge' }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-6 text-base">
        <!-- Judul -->
        <div>
          <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Judul Challenge</label>
          <input v-model="form.title" placeholder="Misal: SQL Injection 101"
            class="w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required />
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Deskripsi</label>
          <textarea v-model="form.description" placeholder="Deskripsi singkat tentang challenge ini..."
            class="w-full px-5 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            rows="5" required></textarea>
        </div>

        <!-- Flag & URL -->
        <div class="grid sm:grid-cols-2 gap-6">
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Flag</label>
            <input v-model="form.flag" :placeholder="config.FLAG_FORMAT"
              class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required />
          </div>

          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">URL Challenge</label>
            <input v-model="form.url" placeholder="https://example.com/challenge" type="url"
              class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required />
          </div>
        </div>

        <!-- Tags with Chips -->
        <div>
          <label class="font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tags</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-for="(tag, index) in form.tags" :key="index"
              class="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-300">
              {{ tag }}
              <span class="ml-2 cursor-pointer hover:text-red-500 text-lg" @click="removeTag(index)">❌</span>
            </span>
          </div>
          <div class="flex gap-2">
              <input
                v-model="newTag"
                ref="tagInputRef"
                @keydown.enter.prevent="addTag"
                placeholder="Masukkan tag lalu tekan Enter"
                class="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            <button type="button" @click="addTag"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Tambah</button>
          </div>
        </div>

        <!-- Hint -->
        <div>
          <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Hint (opsional)</label>
          <input v-model="form.hint" placeholder="Gunakan payload ' OR 1=1 --"
            class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
        </div>

        <!-- Active & Difficulty -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <select v-model="form.difficulty"
            class="w-full sm:w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white cursor-pointer"
            required>
            <option disabled value="">Pilih Tingkat Kesulitan</option>
            <option value="1">🟢 Easy</option>
            <option value="2">🟡 Medium</option>
            <option value="3">🔴 Hard</option>
          </select>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="onCancel"
            class="px-5 py-2.5 text-base bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl">
            Batal
          </button>
          <button type="submit"
            class="px-5 py-2.5 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            {{ formType === 'add' ? '➕ Tambah Challenge' : '💾 Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import config from "../../config"

const props = defineProps({
  formType: String,
  initialData: Object,
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '',
  description: '',
  url: '',
  difficulty: 1,
  tags: [],
  hint: '',
  flag: '',
})

const newTag = ref('')
const tagInputRef = ref<HTMLInputElement | null>(null)

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const submitForm = () => {
  form.difficulty = Number(form.difficulty)
  emit('submit', { ...form })
}

const onCancel = () => {
  emit('cancel')
}

// Load initial data if editing
watch(() => props.initialData, (data) => {
  if (data) {
    Object.assign(form, { ...data, tags: data.tags || [] })
  }
}, { immediate: true })

// enter and escape
const handleKeyDown = (e: KeyboardEvent) => {
  const active = document.activeElement as HTMLElement | null

  // Escape selalu bisa cancel
  if (e.key === 'Escape') {
    onCancel()
  }

  // Enter
  if (e.key === 'Enter') {
    if (
    active === tagInputRef.value ||
    ['TEXTAREA', 'SELECT', 'INPUT'].includes(active?.tagName || '')
  ) return

  submitForm()
  }
}
onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})
</script>