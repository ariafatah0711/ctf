# ✅ Panduan Lengkap Setup & Deploy Platform CTF Web_ARIA

Platform CTF Web_ARIA adalah aplikasi latihan dan kompetisi Capture The Flag (CTF) berbasis **Vue.js**, **Next.js**, dan **Supabase**, lengkap dengan fitur manajemen challenge, leaderboard, serta autentikasi user.

---

## ✨ Langkah Cepat Setup & Deployment

### 1. Buat Akun Supabase & Vercel
- [🔗 Supabase](https://supabase.com) – untuk database dan autentikasi
- [🔗 Vercel](https://vercel.com) – untuk hosting frontend & backend

---

### 2. Setup Supabase (Migrasi DB ke Cloud)

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

> 💡 Dapatkan `<PROJECT_REF>` dari Supabase Dashboard > Settings > General

---

### 3. Generate ENCRYPTION_KEY (untuk enkripsi flag)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
> 🔐 Simpan ke `.env` backend

---

### 4. Setup Environment Variable

#### 📁 Backend (`/backend/.env`)
```env
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

ENCRYPTION_KEY=<generated-random-key>
BASE_URL=<url-frontend-anda>
```

#### 📁 Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=<url-backend-anda>
VITE_FLAG_FORMAT=CWA{FLAG}
VITE_PASSWORD_REMEMBER_ME_LOGIN=<secret-key-login>
```

---

## 📂 Struktur Config Frontend (`/frontend/src/config/env`)

Tersedia konfigurasi seperti:
- Nama & Deskripsi App
- Gambar Halaman (icon)
- Format & Regex Flag
- Konfigurasi theme, caching, dsb

### 📂 Example Config
```ts
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
`;

// ==============================
// 🏁 Flag Settings
// ==============================
const FLAG_FORMAT = "CWA{FLAG}";
const FLAG_REGEX = /^CWA\{.*\}$/;
```

---

## 💻 Install & Jalankan di Development Mode

### Opsi 1 (Jalankan terpisah frontend & backend)
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Jalankan
cd ../backend && npm run dev
cd ../frontend && npm run dev

# mode dev:prod
cd ../backend && npm run dev:prod
```

### Opsi 2 (Pakai Concurrently di root)
```bash
# Di folder root
npm install
cd frontend && npm install
cd ../backend && npm run dev && cd ..
npm run dev
```

---
## 🚀 Deploy ke Production

### 1. Deploy Frontend
```bash
cd frontend
vercel --prod -t <VERCEL_TOKEN>
```

### 2. Deploy Backend
```bash
cd ../backend
vercel --prod -t <VERCEL_TOKEN>
```

> 💡 **Catatan:** Token dapat dibuat di **Vercel > Account Settings > Tokens**

---

## ⚙️ Setup Akun (Initial Setup)

Setelah proses deployment selesai, buka aplikasi di browser dan akses endpoint berikut untuk melakukan setup awal:

```
https://<your-domain>/setup
```

Di halaman `/setup`, Anda dapat membuat akun root/admin pertama untuk mengelola aplikasi.

---

✅ Selesai! Aplikasi Anda sudah siap digunakan di lingkungan production.

---

## 🗄️ Backup & Restore Supabase

### 📦 Backup & Restore Skema
```bash
# Backup skema
supabase db dump --file backup/backup_v1.sql

# Restore skema
supabase db restore backup/backup_v1.sql
```

### 🧾 Backup & Restore Data Manual
```bash
# Backup seluruh data dengan pg_dump
pg_dump -h db.<project-ref>.supabase.co -U postgres -d postgres -p 5432 -F c -f full_backup.dump

# Restore data dengan pg_restore
pg_restore -h db.<project-ref>.supabase.co -U postgres -d postgres -p 5432 -c full_backup.dump
```

> ⚠️ **Gunakan Connection Pooler** jika Anda menggunakan Supabase Free Tier untuk menghindari batas koneksi.

---

### 🔄 Backup Otomatis
- [sesto-dev/supabase-database-backup](https://github.com/sesto-dev/supabase-database-backup)

### 🌙 Supabase Tetap Aktif (Keep Alive)
- [travisvn/supabase-pause-prevention](https://github.com/travisvn/supabase-pause-prevention) — Tambahkan cronjob untuk mencegah project tertidur

---

### ⬆️ Push Database Lokal ke Supabase Cloud
```bash
# Cek perbedaan skema lokal dengan cloud
supabase db diff --local --file v2.3

# Push perubahan ke Supabase
supabase db push
```

---

## 🔒 Catatan Penting
- Tambahkan semua `.env` ke **Environment Variables di Vercel** secara manual
- Gunakan `https` di production
- `ENCRYPTION_KEY` harus **unik & rahasia**
- Backup database secara berkala

---

## 🌐 Tentang CTF Web_ARIA

> Platform latihan dan kompetisi **Capture The Flag (CTF)** untuk semua level. Belajar keamanan siber, uji kemampuanmu, dan capai posisi tertinggi di leaderboard!

**Fitur Utama:**
- 🔐 Login & manajemen user
- 🧩 CRUD challenge publik & admin
- 🏁 Submit flag + Leaderboard
- 👤 Profil + Riwayat Submit
- 🎯 Filter berdasarkan kategori
- 🌓 Dark & Light Mode
- ⚡ Ringan & Responsif

Open-source, aktif dikembangkan bersama komunitas.

[🌐 GitHub Repo](https://github.com/ariafatah0711/ctf) | [📖 Blog](https://ariaf.my.id/blog/ctf_web) | [⬆️ Upload Challenge](/#/challenges/upload) | [💬 Komunitas](https://s.id/dev-universe)

