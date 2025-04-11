<template>
    <div class="min-h-screen w-full fixed flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pb-30">
      <div class="max-w-md w-full">
        <AuthForm
          v-if="!setupCompleted"
          title="Setup Admin"
          :fields="fields"
          :model="form"
          :loading="loading"
          loadingText="Memproses..."
          submitText="Setup"
          :error="error"
          :success="success ? 'Setup berhasil! Redirect ke verifikasi...' : ''"
          :onSubmit="handleSetup"
          color="blue"
        />
        <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center text-sm">
          <router-link to="/login" class="inline-block text-green-500 hover:underline dark:text-green-500">
            Setup sudah dilakukan! Anda tidak dapat mengatur ulang admin. Kembali ke Login
          </router-link>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '@/components/AuthForm.vue';
import { checkSetupStatus, setupAdmin } from '@/services/authService';

const form = reactive({
    username: 'admin',
    email: '',
    password: '',
});

const fields = [
    { name: 'username', label: 'Username', type: 'text', disabled: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
];

const loading = ref(false);
const error = ref('');
const success = ref(false);
const setupCompleted = ref(false);
const router = useRouter();

onMounted(async () => {
    try {
        const data = await checkSetupStatus();
        if (data.message === 'Setup sudah dilakukan.') {
            setupCompleted.value = true;
        }
    } catch (err) {
        console.error('Terjadi kesalahan saat memeriksa status setup.', err);
    }
});

async function handleSetup() {
loading.value = true;
error.value = '';

try {
    await setupAdmin({ email: form.email, password: form.password });
        success.value = true;
        setTimeout(() => router.push('/verify'), 2000);
    } catch (err: any) {
        error.value = err.message || 'Gagal melakukan setup';
    } finally {
        loading.value = false;
    }
}

// Enter key to submit
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSetup();
};
onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>  