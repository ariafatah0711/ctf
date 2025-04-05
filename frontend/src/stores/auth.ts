import GlobalSwal from '../utills/GlobalSwal';
import { defineStore } from 'pinia';
import config from "../config";
import router from '../router';

const Swal = GlobalSwal;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: sessionStorage.getItem('username') || '',
    role: sessionStorage.getItem('role') || '',
    isAuthenticated: !!localStorage.getItem('token'),
    isAuthChecked: false,
  }),
  actions: {
    login(session: any, user: any) {
      this.token = session.access_token;
      this.username = user.username || '';
      this.role = user.role || '';
      this.isAuthenticated = true;

      localStorage.setItem('token', session.access_token);
      sessionStorage.setItem('username', user.username);
      sessionStorage.setItem('role', user.role || '');
    },

    logout() {
      this.token = '';
      this.username = '';
      this.role = '';
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('role');

      router.push('/login');
    },

    async checkAuth() {
      if (!this.token) {
        this.logout();
        return false;
      }

      try {
        const res = await fetch(`${config.BASE_URL}/api/users/auth`, {
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

        const data = await res.json();
        console.log(data)

        this.username = data.user.username;
        this.role = data.user.role;
        this.isAuthenticated = true;

        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('role', data.user.role);

        return true;

      } catch (err) {
        Swal.fire({
          icon: navigator.onLine ? 'error' : 'warning',
          title: navigator.onLine ? 'Server Error' : 'Koneksi Terputus',
          text: navigator.onLine ? 'Gagal menghubungi server. Silakan coba lagi nanti.' : 'Tidak ada koneksi internet.',
          confirmButtonText: 'Oke',
        });
        this.logout();
        return false;
      } finally {
        this.isAuthChecked = true;
      }
    }
  },
});