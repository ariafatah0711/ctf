// src/config.ts

// ==============================
// 🔐 Secrets / Environment Variables
// ==============================
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const PASSWORD_REMEMBER_ME_LOGIN = import.meta.env.VITE_PASSWORD_REMEMBER_ME_LOGIN || "secret123";

// ==============================
// ⚙️ App Configuration
// ==============================
const APP_NAME = "CTF WEB_ARIA"
const DEFAULT_THEME = "dark";
const VERIV_EMAIL = false;
const UPLOAD_CLIENT = true;
const CACHE_TTL =  5 * 60 * 1000; // 5 menit
const IMG_HOMEPAGE = "/icon.png" // frontend/public
const IMG_LOGINPAGE = "/icon_login.png"
const IMG_REGISPAGE = "/icon_regis.png"
const APP_DESCRIPTION = `
  Platform latihan dan kompetisi <strong>Capture The Flag (CTF)</strong> untuk semua level. 
  Pelajari keamanan siber, uji kemampuanmu, dan raih peringkat tertinggi di leaderboard!<br/>
  Cocok untuk pemula yang ingin belajar maupun pro yang ingin unjuk skill.
`;
const ABOUT_PAGE = `
<p class="text-lg mb-4 leading-relaxed">
  <strong>CTF WEB_ARIA</strong> adalah platform latihan dan kompetisi <strong>Capture The Flag (CTF)</strong> berbasis <strong>Vue.js</strong>, <strong>Supabase</strong>, dan <strong>TailwindCSS</strong>. Dibuat untuk semua level: pemula hingga pro.
</p>

<p class="text-lg mb-4 leading-relaxed">🚀 Fitur unggulan:</p>
<ul class="list-disc list-inside mb-6 space-y-2 text-base">
  <li>🔐 Login dan manajemen user (Supabase Auth)</li>
  <li>🧩 CRUD challenge & upload publik dengan review admin</li>
  <li>🏁 Submit flag & leaderboard real-time</li>
  <li>👤 Halaman profil & histori submit</li>
  <li>🎯 Filter challenge per kategori</li>
  <li>🌓 Mode gelap & terang</li>
  <li>📊 Dashboard monitoring & manajemen challenge</li>
  <li>⚡ Ringan & responsif di semua perangkat</li>
</ul>

<p class="text-lg leading-relaxed mb-6">
  Proyek ini bersifat <strong>open-source</strong> dan terus dikembangkan bersama komunitas. Kontribusi dan feedback sangat kami apresiasi!
</p>

<div class="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
  <a href="https://github.com/ariafatah0711/ctf" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg shadow transition text-center">
    🌐 GitHub Repo
  </a>
  <a href="https://ariaf.my.id/blog/ctf_web" target="_blank" class="bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 py-3 px-5 rounded-lg shadow transition text-center">
    📖 Blog
  </a>
  <a href="/#/challenges/upload" class="bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded-lg shadow transition text-center">
    ⬆️ Upload Challenge
  </a>
  <a href="https://s.id/dev-universe" target="_blank" class="bg-purple-600 hover:bg-purple-700 text-white py-3 px-5 rounded-lg shadow transition text-center">
    💬 Gabung Komunitas
  </a>
</div>
`;

// ==============================
// 🏁 Flag Settings
// ==============================a
const FLAG_FORMAT = "CWA{FLAG}";
const FLAG_REGEX = /^CWA\{.*\}$/;

// ==============================
// 📦 Export Config
// ==============================
export default {
  BASE_URL,
  PASSWORD_REMEMBER_ME_LOGIN,
  APP_NAME,
  APP_DESCRIPTION: APP_DESCRIPTION.trim(),
  ABOUT_PAGE,
  DEFAULT_THEME,
  VERIV_EMAIL,
  UPLOAD_CLIENT,
  CACHE_TTL,
  IMG_HOMEPAGE,
  IMG_LOGINPAGE,
  IMG_REGISPAGE,
  FLAG_FORMAT,
  FLAG_REGEX
};