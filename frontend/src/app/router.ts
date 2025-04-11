// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import config from '../config/env';
import { swalError, swalAlert } from '../utils/swalAlert';

// Pages auth
import RegisterPage from '@/pages/register.vue';
import LoginPage from '@/pages/login.vue';
import Verify from '@/pages/Verify.vue';
import ForgotPassword from '@/pages/forgot-password.vue';
import Setup from '@/pages/Setup.vue';

// pages feature
import HomePage from '@/pages/index.vue';
import About from '@/pages/About.vue';
import ProfilePage from '@/pages/profile.vue';
import History from '@/pages/History.vue';
import LeaderboardPage from '@/pages/leaderboard.vue';
import ChallengePage from '@/pages/challenges/index.vue';
import ChallengeDetailPage from '@/pages/challenges/detail.vue';
import UploadChallengePage from '@/_pages/challenges/upload.vue';
import DashboardPage from '@/pages/dashboard/index.vue';
import DashboardChallengesPage from '@/_pages/DashboardChallengesPage.vue';
import DashboardUsersPage from '@/_pages/DashboardUsersPage.vue';
import DashboardClientChallengesPage from '@/_pages/Dashboard/DashboardClientChallengesPage.vue';

const routes = [
  // Public Routes
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { requiresGuest: true } },
  { path: '/setup', name: 'Setup', component: Setup },
  { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardPage },
  { path: '/about', name: 'About', component: About },
  { path: '/verify', name: 'Verify', component: Verify, meta: { requiresGuest: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { requiresGuest: true } },

  // Authenticated User Routes
  { path: '/challenges', name: 'ChallengePage', component: ChallengePage, meta: { requiresAuth: true } },
  { path: '/challenges/:id', name: 'ChallengeDetail', component: ChallengeDetailPage, meta: { requiresAuth: true } },
  { path: '/profile/:username', name: 'ProfilePageByUsername', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/profile', name: 'ProfilePageMe', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/history', name: 'History', component: History, meta: { requiresAuth: true } },

  // Dashboard Routes
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/dashboard/challenges', name: 'DashboardChallenges', component: DashboardChallengesPage, meta: { requiresAuth: true, requiresMaker: true } },
  { path: '/dashboard/users', name: 'DashboardUsers', component: DashboardUsersPage, meta: { requiresAuth: true, requiresAdmin: true } },

  // Conditional Routes
  ...(config.UPLOAD_CLIENT ? [
    {
      path: '/dashboard/upload',
      name: 'DashboardClientChallengesPage',
      component: DashboardClientChallengesPage,
      meta: { requiresAuth: true, requiresMaker: true },
    },
    {
      path: '/challenges/upload',
      name: 'ChallengeUpload',
      component: UploadChallengePage,
      meta: { requiresAuth: true },
    }
  ] : []),

  // Catch-all fallback
  { path: '/:slug(.*)*', name: 'NotFound', component: HomePage },
];

// Router setup
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Middleware: before navigation
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();

  // Cek jika butuh login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    await swalError('Akses Dibatasi', 'Anda perlu login terlebih dahulu untuk mengakses halaman ini.');
    return next('/login');
  }

  // Cek jika hanya untuk guest
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    await swalAlert('Anda sudah login!', 'Silakan logout jika ingin mendaftar ulang.');
    return next('/');
  }

  // Cek jika butuh role admin
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    await swalError('Akses Dibatasi', 'Hanya admin yang dapat mengakses halaman ini.');
    return next('/dashboard');
  }

  // Cek jika butuh role maker atau admin
  if (to.meta.requiresMaker && !['maker', 'admin'].includes(auth.user?.role)) {
    await swalAlert('Akses Dibatasi', 'Hanya maker atau admin yang dapat mengakses halaman ini.', 'warning');
    return next('/dashboard');
  }

  // Semua OK, lanjut
  next();
});

// Middleware: after navigation
router.afterEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    setTimeout(() => {
      auth.checkAuth();
      console.log("check");
    }, 2000);
  }
});

export default router;