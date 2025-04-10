<template>
    <div class="w-full sm:max-w-3xl sm:min-w-[500px] min-w-full mx-auto sm:scale-100 scale-90">
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {{ type === 'add' ? '➕ Tambah Pengguna Baru' : '✏️ Edit Pengguna' }}
        </h2>
  
        <!-- Form Utama -->
        <div class="space-y-6 text-base">
          <!-- Nama Pengguna -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Nama Pengguna</label>
            <input
              v-model="form.name"
              placeholder="Misal: John Doe"
              class="w-full px-5 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
  
          <!-- Email -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@domain.com"
              class="w-full px-5 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
  
          <!-- Password -->
          <div>
            <label class="font-medium text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Password Pengguna"
              class="w-full px-5 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
        </div>

        <!-- Tombol Submit -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="onCancel"
            class="px-5 py-2.5 text-base bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl"
          >
            Batal
          </button>
          <button
            type="submit"
            @click.prevent="handleSubmit"
            class="px-5 py-2.5 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            💾 Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { reactive, watch, onMounted, onUnmounted  } from 'vue'
  
  const props = defineProps({
    type: String,
    initialData: Object
  })
  
  const emit = defineEmits(['cancel', 'submit'])
  
  const form = reactive({
    name: '',
    email: '',
    password: '',
    id: null,
  })

  // enter and escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }
  onMounted(() => {window.addEventListener('keydown', handleKeyDown)})
  onUnmounted(() => {window.removeEventListener('keydown', handleKeyDown)})
  
  const handleSubmit = () => {
    console.log('Submit', form)
    emit('submit', form)
  }

  const onCancel = () => {
    emit('cancel')
    form.name = ''
    form.email = ''
    form.password = ''
    form.id = null
  }
  
  watch(() => props.initialData, (newData) => {
    if (props.type === 'edit' && newData) {
      Object.assign(form, newData)
    }
  }, { immediate: true })
</script>