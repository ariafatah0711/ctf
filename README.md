## ✅ Panduan Lengkap Setup & Instalasi Project CTF Platform

### 1. Buat Akun Supabase & Vercel
- Daftar di https://supabase.com
- Daftar di https://vercel.com

---

### 2. Setup Supabase (Migrasi DB ke Supabase)
```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```
> 💡 Ambil `<PROJECT_REF>` di dashboard Supabase > Settings > General

---

### 3. Setup & Deploy Frontend dan Backend ke Vercel
```bash
# Deploy Frontend
cd frontend
vercel -t <VERCEL_TOKEN>

# Deploy Backend
cd ../backend
vercel -t <VERCEL_TOKEN>
```
> 💡 Token bisa dibuat di dashboard Vercel > Account Settings > Tokens

---

### 4. Generate ENCRYPTION_KEY
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
> Simpan hasilnya di `.env` **backend**

---

## ⚙️ Environment Variable Setup

### 📁 Backend (`/backend/.env`)
```
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

ENCRYPTION_KEY=<hasil-dari-crypto-randomBytes>
BASE_URL=<your-base-url-frontentend>
```

### 📁 Frontend (`/frontend/.env`)
```
VITE_API_BASE_URL=<your-base-url-backend>
VITE_FLAG_FORMAT=<yout-format-flag>
VITE_PASSWORD_REMEMBER_ME_LOGIN=<your_secret_key_for_remeber_password_form_login>
```

---

## 💻 Install & Run (Development Mode) 1

### 📦 Install dependencies
```bash
cd frontend
npm install

cd ../backend
npm install
```

### 🚀 Jalankan Dev Mode
```bash
# Jalankan backend
cd backend
npm run dev

# Jalankan frontend
cd ../frontend
npm run dev
```

## 💻 Install & Run (Development Mode) 2

### 📦 Install dependencies
```bash
cd frontend
npm install

cd ../backend
npm install
```

### 🚀 Jalankan Dev Mode
```bash
cd ..
npm install
npm run dev # use concurently
```

---

## 🚢 Deploy ke Production
```bash
cd frontend
vercel --prod -t <token>

cd ../backend
vercel --prod -t <token>
```

---

## Cara Push Db lokal ke supabase cloud
```bash
supabase db diff --local --file v1.5
supabase db push
```

## add cronjob
- [https://github.com/travisvn/supabase-pause-prevention](https://github.com/travisvn/supabase-pause-prevention)

## 🔐 Catatan Penting
- Tambahkan `.env` ke Vercel Environment Variables secara manual via Dashboard.
- `ENCRYPTION_KEY` harus unik dan aman.
- Gunakan `https` di production.