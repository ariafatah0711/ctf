import GlobalSwal from '../utills/GlobalSwal';
import { defineStore } from 'pinia';
import config from "../config";
import router from '../router';

const Swal = GlobalSwal;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user') || '{}'), // ambil data user sebagai objek
    isAuthenticated: !!localStorage.getItem('token'),
    isAuthChecked: false,
    isCheckingAuth: false,
  }),
  actions: {
    login(session: any, user: any) {
      // simpan user sebagai objek di sessionStorage
      this.user = {
        token: session.access_token,
        username: user.username || '',
        role: user.role || '',
        avatar: user.avatar || '',
      };

      this.isAuthenticated = true;

      localStorage.setItem('token', session.access_token);
      sessionStorage.setItem('user', JSON.stringify(this.user)); // simpan objek user
    },

    logout() {
      this.user = {}; // reset data user
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      sessionStorage.removeItem('user'); // hapus objek user

      router.push('/login');
    },

    async checkAuth() {
      if (this.isCheckingAuth) return; // prevent double call
      this.isCheckingAuth = true;

      // Periksa token di localStorage
      if (!this.user.token) {
        this.logout();
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 250)); // tambahkan delay jika perlu

      try {
        const res = await fetch(`${config.BASE_URL}/api/users/auth`, {
          headers: { Authorization: `Bearer ${this.user.token}` },
        });

        if (res.status === 401 || res.status === 403) {
          await Swal.fire({
            icon: 'warning',
            title: 'Sesi Habis',
            text: 'Sesi login kamu telah berakhir. Silakan login kembali.',
            confirmButtonText: 'Login Ulang',
          });
          this.logout();
          return false;
        }

        const data = await res.json();

        // Update objek user
        this.user = {
          username: data.user.username,
          role: data.user.role,
          avatar: data.user.avatar || '',
          token: this.user.token, // token tetap sama
        };

        this.isAuthenticated = true;

        sessionStorage.setItem('user', JSON.stringify(this.user));

        return true;

      } catch (err) {
        if (!navigator.onLine) {
          await Swal.fire({
            icon: 'warning',
            title: 'Koneksi Terputus',
            text: 'Tidak ada koneksi internet.',
            confirmButtonText: 'Oke',
          });
        } else {
          console.error('checkAuth error:', err);
        }
        return false;
      } finally {
        this.isCheckingAuth = false;
        this.isAuthChecked = true;
      }
    }
  },
});