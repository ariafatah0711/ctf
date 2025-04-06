<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GlobalSwal from '../utills/GlobalSwal';
const Swal = GlobalSwal;
const router = useRouter();

const password = ref('');
const token = ref('');
const loading = ref(false);

onMounted(() => {
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.slice(1));
  const t = params.get('access_token');
  if (!t) {
    Swal.fire({ icon: 'error', title: 'Token tidak ditemukan', text: 'Klik ulang link di email.' });
    router.push('/forgot-password');
    return;
  }
  token.value = t;
});

async function handleResetPassword() {
  loading.value = true;
  try {
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value, newPassword: password.value }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Password berhasil diubah.' });
    router.push('/login');
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err.message });
  } finally {
    loading.value = false;
  }
}
</script>