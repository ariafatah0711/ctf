import GlobalSwal from '../utills/GlobalSwal';
import { defineStore } from 'pinia';
import config from "../config";
import router from '../router';
import { encryptUserData, decryptUserData } from '../utills/crypto';

const Swal = GlobalSwal;

function getUserFromLocalStorage() {
  const encrypted = localStorage.getItem('user');
  return encrypted ? decryptUserData(encrypted) || {} : {};
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getUserFromLocalStorage(),
    isAuthChecked: false,
    isCheckingAuth: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user.token,
  },
  actions: {
    login(session: any, user: any) {
      console.log(user)
      this.user = {
        token: session.access_token,
        username: user.user_metadata.display_name || '',
        role: user.user_metadata.role || '',
        avatar: user.user_metadata.avatar || '',
      };

      const encrypted = encryptUserData(this.user);
      localStorage.setItem('user', JSON.stringify(encrypted));
    },

    logout() {
      this.user = {};
      localStorage.removeItem('user');
      router.push('/login');
    },

    async checkAuth() {
      if (this.isCheckingAuth) return;
      this.isCheckingAuth = true;

      // Periksa token di localStorage
      if (!this.user.token) {
        this.logout();
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 250));

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
          token: this.user.token,
        };

        const encrypted = encryptUserData(this.user);
        localStorage.setItem('user', JSON.stringify(encrypted));

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