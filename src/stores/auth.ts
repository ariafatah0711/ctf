import GlobalSwal from '../utills/GlobalSwal';
import { defineStore } from 'pinia';
import router from '../router';
const Swal = GlobalSwal;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '', // Token tetap disimpan
    username: '', // Username tidak disimpan
    isAuthenticated: !!localStorage.getItem('token'),
  }),
  actions: {
    login(token: string) {
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = '';
      this.username = '';
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      router.push('/login');
    },
    async checkAuth() {
      try {
        const res = await fetch('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        });
    
        if (res.status === 401 || res.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'Sesi Habis',
            text: 'Sesi login kamu telah berakhir. Silakan login kembali.',
            confirmButtonText: 'Login Ulang',
          });
          this.logout();
          return false;
        }
    
        if (!res.ok) {
          console.warn('Server error tapi tidak logout');
          return true;
        }
    
        const data = await res.json();
        this.username = data.user.username;
        this.isAuthenticated = true;
        return true;
      } catch (err) {
        if (!navigator.onLine) {
          Swal.fire({
            icon: 'warning',
            title: 'Koneksi Terputus',
            text: 'Tidak ada koneksi internet. Silakan periksa koneksi kamu.',
            confirmButtonText: 'Oke',
          });
        } else {
          console.error('Network/server error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghubungi Server',
            text: 'Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.',
            confirmButtonText: 'Oke',
          });
        }
        return true;
      }
    }
  },
});