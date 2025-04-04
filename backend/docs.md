**Kanvas API Challenges**

---

**Umum:**
- **Base URL:** `{{base_url}}/api/challenges` *(Ganti dengan URL API yang sebenarnya)*
- **Autentikasi:** Token diperlukan untuk sebagian besar aksi di header: `Authorization: Bearer <token>`

---

### **Challenge Endpoints**

#### **GET /**
- **Deskripsi:** Ambil semua challenges.
- **Metode:** GET
- **Otorisasi:** Ya (Token)
- **Respon:**
```json
[
  {
    "id": "some_unique_id_1",
    "title": "Tantangan Web Sederhana",
    "description": "Temukan flag tersembunyi di source code halaman ini.",
    "difficulty": 1,
    "url": "http://contoh-web.com",
    "tags": ["web", "basic"],
    "hint": "Lihat bagian komentar di HTML."
  }
]
```

#### **POST /add**
- **Deskripsi:** Tambah challenge baru (admin/maker saja).
- **Metode:** POST
- **Otorisasi:** Ya (Token)
- **Body:**
```json
{
  "title": "Tantangan Web Sederhana",
  "description": "Temukan flag tersembunyi di source code halaman ini.",
  "difficulty": 1,
  "flag": "flag{ini_flag_web}",
  "url": "http://contoh-web.com",
  "tags": ["web", "basic"],
  "hint": "Lihat bagian komentar di HTML."
}
```
- **Respon:**
```json
{
  "message": "Challenge berhasil ditambahkan!"
}
```

#### **PUT /{challenge_id}**
- **Deskripsi:** Edit challenge (admin/maker saja).
- **Metode:** PUT
- **Otorisasi:** Ya (Token)
- **Body:**
```json
{
  "title": "Tantangan Web Sederhana (Diperbarui)",
  "description": "Temukan flag tersembunyi di source code halaman ini. Petunjuk baru ditambahkan.",
  "difficulty": 2,
  "flag": "flag{ini_flag_web_update}",
  "url": "http://contoh-web.com/baru",
  "tags": ["web", "mudah"],
  "hint": "Cari juga di file JavaScript."
}
```
- **Respon:**
```json
{
  "message": "Challenge berhasil diperbarui!"
}
```

#### **DELETE /{challenge_id}**
- **Deskripsi:** Hapus challenge (admin/maker saja).
- **Metode:** DELETE
- **Otorisasi:** Ya (Token)
- **Respon:**
```json
{
  "message": "Challenge berhasil dihapus!"
}
```

#### **POST /submit**
- **Deskripsi:** Submit jawaban challenge.
- **Metode:** POST
- **Body:**
```json
{
  "flag": "flag{jawaban_user}"
}
```
- **Respon (Benar):** Status 200 OK
- **Respon (Salah):**
```json
{
  "message": "Flag salah."
}
```

---

### **API Users**

#### **POST /api/auth/register**
- **Deskripsi:** Daftar pengguna baru.
- **Metode:** POST
- **Body:**
```json
{
  "username": "nama_pengguna",
  "email": "email@contoh.com",
  "password": "kata_sandi"
}
```
- **Respon:**
```json
{
  "message": "User berhasil didaftarkan"
}
```

#### **POST /api/auth/login**
- **Deskripsi:** Login untuk mendapatkan token.
- **Metode:** POST
- **Body:**
```json
{
  "username": "nama_pengguna",
  "password": "kata_sandi"
}
```
- **Respon:**
```json
{
  "message": "Login successful",
  "token": "token_otentikasi"
}
```

#### **GET /api/users**
- **Deskripsi:** Ambil daftar semua pengguna.
- **Metode:** GET
- **Otorisasi:** Ya (Token)
- **Respon:**
```json
{
  "message": "Data pengguna berhasil diambil.",
  "data": [
    {
      "id": "user_id",
      "username": "nama_pengguna",
      "email": "email@contoh.com",
      "role": "user/admin",
      "created_at": "waktu_dibuat",
      "updated_at": "waktu_diupdate"
    }
  ]
}
```

#### **PUT /api/users/{user_id}**
- **Deskripsi:** Edit data pengguna.
- **Metode:** PUT
- **Body:**
```json
{
  "username": "nama_pengguna_baru",
  "password": "kata_sandi_baru",
  "role": "user/admin"
}
```
- **Respon:**
```json
{
  "message": "User updated successfully"
}
```

#### **DELETE /api/users/{user_id}**
- **Deskripsi:** Hapus pengguna berdasarkan ID.
- **Metode:** DELETE
- **Respon:**
```json
{
  "message": "User berhasil dihapus!"
}
```

---

**Catatan Penting:**
- Semua endpoint yang memerlukan token akan mengembalikan status **403 Forbidden** jika token tidak ada atau tidak valid.
- Ganti `{{base_url}}` dan `{{token}}` dengan nilai aktual dalam implementasi frontend.