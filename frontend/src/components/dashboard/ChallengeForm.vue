<template>
<div class="w-full sm:max-w-3xl sm:min-w-[500px] min-w-full mx-auto sm:scale-100 scale-90">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ type === 'add' ? '➕ Tambah Challenge Baru' : '✏️ Edit Challenge' }}
        </h2>
  
        <!-- Form Utama -->
        <div class="space-y-6 text-base">
          <!-- Judul -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Judul Challenge</label>
            <input
              v-model="form.title"
              placeholder="Misal: SQL Injection 101"
              class="w-full px-5 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
  
          <!-- Deskripsi -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Deskripsi</label>
            <textarea
              v-model="form.description"
              placeholder="Deskripsi singkat tentang challenge ini..."
              class="w-full px-5 py-3 text-base border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              rows="5"
              required
            ></textarea>
          </div>
  
          <!-- Flag & URL -->
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Flag</label>
              <input
                v-model="form.flag"
                placeholder="CTF{contoh_flag}"
                class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
  
            <div>
              <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">URL Challenge</label>
              <input
                v-model="form.url"
                placeholder="https://example.com/challenge"
                class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
          </div>
  
          <!-- Tags dengan chip -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tags (opsional)</label>
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-300"
              >
                {{ tag }}
                <span class="ml-2 cursor-pointer hover:text-red-500 text-lg" @click="removeTag(index)">❌</span>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newTag"
                @keyup.enter="addTag"
                placeholder="Masukkan tag lalu tekan Enter"
                class="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <button @click="addTag" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                Tambah
              </button>
            </div>
          </div>
  
          <!-- Hint -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Hint (opsional)</label>
            <input
              v-model="form.hint"
              placeholder="Gunakan payload ' OR 1=1 --"
              class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
  
          <!-- Aktif dan Difficulty -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <!-- Switch Aktif -->
            <label class="flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer">
              <span class="text-base">Challenge Aktif</span>
              <input
                type="checkbox"
                v-model="form.active"
                class="relative w-11 h-6 rounded-full appearance-none bg-gray-300 dark:bg-slate-600 checked:bg-green-500 transition duration-200 before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5 before:bg-white before:rounded-full before:transition-transform before:duration-200 checked:before:translate-x-5"
              />
            </label>
  
            <!-- Difficulty -->
            <select
              v-model="form.difficulty"
              required
              class="w-full sm:w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white cursor-pointer"
            >
              <option disabled value="">Pilih Tingkat Kesulitan</option>
              <option value="1">🟢 Easy</option>
              <option value="2">🟡 Medium</option>
              <option value="3">🔴 Hard</option>
            </select>
          </div>
        </div>
  
        <!-- Tombol Submit -->
        <div class="flex justify-end gap-3 pt-4">
          <button @click="onCancel" class="px-5 py-2.5 text-base bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl">
            Batal
          </button>
          <button
            type="submit"
            @click.prevent="handleSubmit"
            class="px-5 py-2.5 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {{ type === 'add' ? '➕ Tambah Challenge' : '💾 Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { swalError } from '../../utills/swalAlert'

const props = defineProps({
  type: String,
  initialData: Object
})

const emit = defineEmits(['cancel', 'submit'])

const form = reactive({
  title: '',
  description: '',
  flag: '',
  url: '',
  tags: [],
  hint: '',
  active: false,
  difficulty: 1,
  id: null, // penting untuk mode edit
})

const newTag = ref('')

const addTag = () => {
  if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
    form.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const handleSubmit = () => {
  form.difficulty = Number(form.difficulty);

  if (isNaN(Number(form.difficulty)) || form.difficulty === '') {
    swalError('Difficulty harus berupa angka.');
    return;
  }

  console.log('Submit', form)
  emit('submit', form)
}

const onCancel = () => {
  emit('cancel')
  form.title = ''
  form.description = ''
  form.flag = ''
  form.url = ''
  form.tags = []
  form.hint = ''
  form.active = false
  form.difficulty = 1
  form.id = null
}

// enter and escape
const handleKeyDown = (e: KeyboardEvent) => {
  const active = document.activeElement as HTMLElement | null

  // Escape selalu bisa cancel
  if (e.key === 'Escape') {
    onCancel()
  }

  // Enter
  if (e.key === 'Enter') {
    // Cegah trigger submit kalau lagi fokus di input tag atau textarea atau select
    if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || (active instanceof HTMLInputElement && active.placeholder?.includes('tag')))) return
    handleSubmit()
  }
}
onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})

// ⬇️ Taruh watch-nya di sini
watch(() => props.initialData, (newData) => {
  if (props.type === 'edit' && newData) {
    Object.assign(form, newData)
  }
}, { immediate: true })
</script>