// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import ChallengeDetailPage from '../pages/ChallengeDetailPage.vue';
import LeaderboardPage from '../pages/LeaderboardPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import Setup from '../pages/Setup.vue';
import About from '../pages/About.vue';
import ChallengePage from '../pages/ChallengePage.vue';
import Verify from '../pages/Verify.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import DashboardChallengesPage from '../pages/DashboardChallengesPage.vue';
import DashboardUsersPage from '../pages/DashboardUsersPage.vue';
import ForgotPassword from '../pages/ForgotPassword.vue';
import { useAuthStore } from '../stores/auth';
import GlobalSwal from '../utills/GlobalSwal';
const Swal = GlobalSwal

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup
  },
  {
    path: '/challenges',
    name: 'ChallengePage',
    component: ChallengePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardPage,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/verify',
    name: 'Verify',
    component: Verify,
    meta: { requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot password',
    component: ForgotPassword,
    meta: { requiresGuest: true },
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: AdminDashboard,
  //   meta: { requiresAuth: true, requiresAdmin: true },
  // },
  {
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardPage, // Halaman dashboard utama
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard/challenges', // Halaman challenges
    name: 'DashboardChallenges',
    component: DashboardChallengesPage,
    meta: { requiresAuth: true, requiresMaker: true },
  },
  {
    path: '/dashboard/users', // Halaman untuk manajemen user, hanya admin
    name: 'DashboardUsers',
    component: DashboardUsersPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:slug(.*)*', // catch-all
    name: 'DynamicPage',
    component: HomePage,
  },
  {
    path: '/challenges/:id',
    name: 'ChallengeDetail',
    component: ChallengeDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:username',
    name: 'ProfilePage By Username',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'ProfilePage ME',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  // console.log(auth.user.username, auth.user.role)
  console.log(auth)

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    await Swal.fire({
      title: 'Akses Dibatasi',
      text: 'Anda perlu login terlebih dahulu untuk mengakses halaman ini.',
      icon: 'warning',
      confirmButtonText: 'Login',
    });
    next('/login');
    return; 
  } else

  // Untuk halaman yang membutuhkan guest dan pengguna sudah login
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    Swal.fire({
      title: 'Anda sudah login!',
      text: 'Anda sudah login. Silakan keluar terlebih dahulu jika ingin mendaftar ulang.',
      icon: 'info',
      confirmButtonText: 'OK'
    })
    next('/');
    return;
  } else

  if (to.meta.requiresAdmin && auth.user.role !== 'admin') {
      await Swal.fire({
        title: 'Akses Dibatasi',
        text: 'Hanya admin yang dapat mengakses halaman ini.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      next('/dashboard');
      return;
  } else

  if (to.meta.requiresMaker && !['maker', 'admin'].includes(auth.user.role)) {
    Swal.fire({
      title: 'Akses Dibatasi',
      text: 'Halaman ini hanya bisa diakses oleh pengguna dengan role maker atau admin.',
      icon: 'warning',
      confirmButtonText: 'OK',
    })
    next('/dashboard');
    return;
  }

  // if (to.meta.requiresAuth) {
  //   setTimeout(() => {
  //     auth.checkAuth();
  //     console.log("check");
  //     }, 3000);
  //   }

  next();
});

// Menggunakan afterEach untuk pengecekan dan notifikasi setelah halaman dimuat
router.afterEach((to, _from) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    setTimeout(() => {
      auth.checkAuth(); // Melakukan pengecekan setelah navigasi
      console.log("check");
    }, 3000); // Menunda sedikit pengecekan autentikasi
  }
});

export default router;