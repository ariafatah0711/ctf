<template>
    <div class="w-full sm:max-w-3xl sm:min-w-[500px] min-w-full mx-auto sm:scale-100 scale-90">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ formType === 'add' ? '➕ Tambah Challenge Baru' : '✏️ Edit Challenge' }}
        </h2>
  
        <form @submit.prevent="submitForm" class="space-y-6 text-base">
          <!-- Judul -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Judul Challenge</label>
            <input
              v-model="localForm.title"
              placeholder="Misal: SQL Injection 101"
              class="w-full px-5 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
  
          <!-- Deskripsi -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Deskripsi</label>
            <textarea
              v-model="localForm.description"
              placeholder="Deskripsi singkat tentang challenge ini..&#10;Flag taruh disini dulu aja ya."
              class="w-full px-5 py-3 text-base border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              rows="5"
            ></textarea>
          </div>
  
          <!-- URL -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">URL Challenge (github / drive / etc)</label>
            <input
              v-model="localForm.url"
              placeholder="https://example.com/challenge"
              type="url"
              class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
  
          <!-- Difficulty -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Tingkat Kesulitan</label>
            <select
              v-model="localForm.difficulty"
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white cursor-pointer"
            >
              <option disabled value="">Pilih Tingkat Kesulitan</option>
              <option :value="1">🟢 Easy</option>
              <option :value="2">🟡 Medium</option>
              <option :value="3">🔴 Hard</option>
            </select>
          </div>
  
          <!-- Tags -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tags (pisah dengan koma)</label>
            <input
              v-model="localForm.tagsInput"
              placeholder="web, sql, ctf"
              type="text"
              class="w-full px-4 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
  
          <!-- Hint -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Hint (opsional)</label>
            <input
              v-model="localForm.hint"
              placeholder="Gunakan payload ' OR 1=1 --"
              class="w-full px-5 py-3 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
  
          <!-- Tombol -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('cancel')"
              class="px-5 py-2.5 text-base bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {{ formType === 'add' ? '➕ Tambah Challenge' : '💾 Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue'
  
  const props = defineProps({
    formType: String,
    initialData: Object,
  })
  const emit = defineEmits(['submit', 'cancel'])
  
  const localForm = reactive({
    title: '',
    description: '',
    url: '',
    difficulty: 1,
    tagsInput: '',
    hint: '',
  })
  
  watch(() => props.initialData, (newData) => {
    Object.assign(localForm, {
      title: newData.title || '',
      description: newData.description || '',
      url: newData.url || '',
      difficulty: newData.difficulty || 1,
      tagsInput: newData.tagsInput || '',
      hint: newData.hint || '',
    })
  }, { immediate: true })
  
  const submitForm = () => {
    emit('submit', { ...localForm })
  }
  </script>