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
import { useAuthStore } from '../stores/auth';

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
    path: '/challenges',
    name: 'ChallengePage',
    component: ChallengePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   meta: { requiresAuth: true },
  // },
  {
    path: '/:slug(.*)*', // catch-all
    name: 'DynamicPage',
    component: HomePage ,
    meta: { requiresAuth: true }, // bisa juga tanpa auth kalau mau
  },
  {
    path: '/challenges/:id',
    name: 'ChallengeDetail',
    component: ChallengeDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:username',
    name: 'ProfilePage',
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
  if (!auth.isAuthChecked) {
    // await auth.checkAuth();
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;