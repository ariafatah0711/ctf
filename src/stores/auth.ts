// import GlobalSwal from '../utills/GlobalSwal';
// import { defineStore } from 'pinia';
// import config from "../config"
// import router from '../router';
// const Swal = GlobalSwal;

// export const useAuthStore = defineStore('auth', {
//   // state: () => ({
//   //   token: localStorage.getItem('token') || '', // Token tetap disimpan
//   //   username: '', // Username tidak disimpan
//   //   role: '',
//   //   isAuthenticated: !!localStorage.getItem('token'),
//   // }),
//   state: () => ({
//     token: localStorage.getItem('token') || '',
//     username: localStorage.getItem('username') || '',
//     role: localStorage.getItem('role') || '',
//     isAuthenticated: !!localStorage.getItem('token'),
//     isAuthChecked: false, // Tambahan
//   }),
//   actions: {
//     // login(token: string) {
//     //   this.token = token;
//     //   this.isAuthenticated = true;
//     //   localStorage.setItem('token', token);
//     // },
//     login(session: any, user: any) {
//       this.token = session.access_token;
//       this.username = user.email; // atau ambil dari metadata kalau ada username
//       this.role = user.role || ''; // opsional
//       this.isAuthenticated = true;
    
//       localStorage.setItem('token', session.access_token);
//       localStorage.setItem('username', user.email);
//       localStorage.setItem('role', user.role || '');
//     },
//     // logout() {
//     //   this.token = '';
//     //   this.username = '';
//     //   this.role = '';
//     //   this.isAuthenticated = false;
//     //   localStorage.removeItem('token');
//     //   router.push('/login');
//     // },
//     logout() {
//       this.token = '';
//       this.username = '';
//       this.role = '';
//       this.isAuthenticated = false;
//       localStorage.removeItem('token');
//       localStorage.removeItem('username');
//       localStorage.removeItem('role');
//       router.push('/login');
//     },
//     // async checkAuth() {
//     //   // return
//     //   try {
//     //     const res = await fetch(`${config.BASE_URL}/api/users/auth`, {
//     //       headers: { Authorization: `Bearer ${this.token}` },
//     //     });
//     //     console.log(res)
//     //     if (res.status === 401 || res.status === 403) {
//     //       Swal.fire({
//     //         icon: 'warning',
//     //         title: 'Sesi Habis',
//     //         text: 'Sesi login kamu telah berakhir. Silakan login kembali.',
//     //         confirmButtonText: 'Login Ulang',
//     //       });
//     //       this.logout();
//     //       return false;
//     //     }
    
//     //     if (!res.ok) {
//     //       const data = await res.json();
//     //       if (res.status === 403 || data.message === "User tidak ditemukan atau tidak valid.") {
//     //         Swal.fire({
//     //           icon: 'warning',
//     //           title: 'Sesi Tidak Valid',
//     //           text: 'Akun kamu sudah tidak tersedia. Silakan login kembali.',
//     //           confirmButtonText: 'Login Ulang',
//     //         });
//     //         this.logout();
//     //         return false;
//     //       }
        
//     //       console.warn('Server error tapi tidak logout');
//     //       return true;
//     //     }
    
//     //     const data = await res.json();
//     //     console.log(data)
//     //     this.username = data.user.username;
//     //     this.role = data.user.role;
//     //     this.isAuthenticated = true;
//     //     return true;
//     //   } catch (err) {
//     //     if (!navigator.onLine) {
//     //       Swal.fire({
//     //         icon: 'warning',
//     //         title: 'Koneksi Terputus',
//     //         text: 'Tidak ada koneksi internet. Silakan periksa koneksi kamu.',
//     //         confirmButtonText: 'Oke',
//     //       });
//     //     } else {
//     //       console.error('Network/server error:', err);
//     //       Swal.fire({
//     //         icon: 'error',
//     //         title: 'Gagal Menghubungi Server',
//     //         text: 'Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.',
//     //         confirmButtonText: 'Oke',
//     //       });
//     //     }
//     //     return true;
//     //   }
//     // }
//     async checkAuth() {
//       try {
//         const res = await fetch(`${config.BASE_URL}/api/users/auth`, {
//           headers: { Authorization: `Bearer ${this.token}` },
//         });
    
//         if (res.status === 401 || res.status === 403) {
//           Swal.fire({
//             icon: 'warning',
//             title: 'Sesi Habis',
//             text: 'Sesi login kamu telah berakhir. Silakan login kembali.',
//             confirmButtonText: 'Login Ulang',
//           });
//           this.logout();
//           return false;
//         }

//         const data = await res.json();

//         this.username = data.user.username;
//         this.role = data.user.role;
//         this.isAuthenticated = true;
//         return true;
    
//       } catch (err) {
//         if (!navigator.onLine) {
//           Swal.fire({
//             icon: 'warning',
//             title: 'Koneksi Terputus',
//             text: 'Tidak ada koneksi internet. Silakan periksa koneksi kamu.',
//             confirmButtonText: 'Oke',
//           });
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Server Error',
//             text: 'Gagal menghubungi server. Silakan coba lagi nanti.',
//             confirmButtonText: 'Oke',
//           });
//         }
    
//         // 🛑 Harus logout kalau gagal validasi (biar gak stuck login)
//         this.logout();
//         return false;
//       } finally {
//         this.isAuthChecked = true;
//       }
//     }
//   },
// });

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
      this.username = user.email;
      this.role = user.role || '';
      this.isAuthenticated = true;

      localStorage.setItem('token', session.access_token);
      sessionStorage.setItem('username', user.email);
      sessionStorage.setItem('role', user.role || '');
    },

    logout(redirect = false) {
      this.token = '';
      this.username = '';
      this.role = '';
      this.isAuthenticated = false;
    
      localStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('role');
    
      if (redirect) {
        router.push('/login'); // hanya kalau logout dari UI biasa
      }
    },

    async checkAuth() {
      if (!this.token) {
        this.logout(false); // no redirect!
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
          this.logout(false); // no redirect
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
        this.logout(false); // no redirect
        return false;
      } finally {
        this.isAuthChecked = true;
      }
    }
  },
});