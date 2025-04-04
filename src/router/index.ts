// import { createRouter, createWebHistory } from 'vue-router';
// import LoginPage from '../pages/LoginPage.vue';
// import RegisterPage from '../pages/RegisterPage.vue';

// const routes = [
//   {
//     path: '/login',
//     name: 'Login',
//     component: LoginPage,
//   },
//   {
//     path: '/register',
//     name: 'Register',
//     component: RegisterPage,
//   },
//   {
//     path: '/',
//     name: 'Home',
//     component: {
//       template: '<div class="p-4">Home - Protected Route (contoh)</div>',
//     },
//     meta: { requiresAuth: true }, // bisa dipakai untuk proteksi nantinya
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore();

//   const publicPages = ['/login', '/register'];
//   const authRequired = !publicPages.includes(to.path);

//   if (authRequired && !auth.isLoggedIn()) {
//     return next('/login');
//   }

//   if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn()) {
//     return next('/');
//   }

//   next();
// });

// export default router;

// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import { useAuthStore } from '../stores/auth'; // ✅ ini perlu!

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
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware auth di route
router.beforeEach((to, from, next) => {
  const auth = useAuthStore(); // ✅ Panggil auth store

  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !auth.isLoggedIn()) {
    return next('/login');
  }

  if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn()) {
    return next('/');
  }

  next();
});

export default router;
