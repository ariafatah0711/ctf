// import { defineStore } from 'pinia';
// import { ref } from 'vue';

// export const useAuthStore = defineStore('auth', () => {
//   const token = ref<string | null>(localStorage.getItem('token'));
//   const isLoggedIn = ref<boolean>(!!token.value);

//   function setToken(newToken: string) {
//     token.value = newToken;
//     isLoggedIn.value = true;
//     localStorage.setItem('token', newToken);
//   }

//   function logout() {
//     token.value = null;
//     isLoggedIn.value = false;
//     localStorage.removeItem('token');
//   }

//   return {
//     token,
//     isLoggedIn,
//     setToken,
//     logout,
//   };
// });

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  actions: {
    login(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = '';
      localStorage.removeItem('token');
    },
    isLoggedIn(): boolean {
      return !!this.token;
    }
  }
});