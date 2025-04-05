// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import ChallengeDetailPage from '../pages/ChallengeDetailPage.vue';
import LeaderboardPage from '../pages/LeaderboardPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import Setup from '../pages/Setup.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/:slug(.*)*', // catch-all
    name: 'DynamicPage',
    component: HomePage ,
    meta: { requiresAuth: true }, // bisa juga tanpa auth kalau mau
  },
  {
    path: '/challenges/:id',
    name: 'ChallengeDetail',
    component: ChallengeDetailPage
  },
  {
    path: '/profile/:username',
    name: 'ProfilePage',
    component: ProfilePage
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: 
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   meta: { requiresAuth: true },
  // }
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

// Middleware auth di route
// router.beforeEach(async (to, _from, next) => {
//   const auth = useAuthStore();

//   // Cek apakah halaman butuh autentikasi
//   if (to.meta.requiresAuth) {
//     const isAuthenticated = auth.isAuthenticated || (await auth.checkAuth());

//     if (!isAuthenticated) {
//       return next('/login');
//     }
//   }

//   // Kalau user udah login, jangan biarkan ke /login atau /register
//   if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
//     return next('/');
//   }

//   next();
// });
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.isAuthChecked) {
    // await auth.checkAuth();
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;