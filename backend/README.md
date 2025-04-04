This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### api
Oke, ini intinya cara penggunaan API challenges buat kamu di FE:

Umum:

Pakai base URL: {{base_url}}/api/challenges (ganti {{base_url}} dengan alamat API sebenarnya).
Butuh token di header Authorization: Bearer <token> untuk sebagian besar aksi.
Endpoint:

GET /: Ambil semua challenges (perlu token).
POST /add: Tambah challenge baru (hanya admin/maker, perlu token). Kirim data challenge di body (JSON).
PUT /{challenge_id}: Edit challenge (hanya admin/maker, perlu token). Ganti {challenge_id} dengan ID challenge. Kirim data edit di body (JSON).
DELETE /{challenge_id}: Hapus challenge (hanya admin/maker, perlu token). Ganti {challenge_id} dengan ID challenge.
POST /submit: Submit jawaban (perlu token). Kirim {"flag": "jawaban"} di body (JSON).
Tanpa Token (Error):

Semua endpoint di atas akan kasih error 403 dan pesan "No token provided" kalau kamu coba tanpa token.
Dengan Token User (Sebagian Error):

GET /: Bisa lihat daftar challenge (status 200).
POST /add, PUT /{challenge_id}, DELETE /{challenge_id}: Akan kasih error 403 dan pesan "Access denied" karena user biasa tidak bisa menambah, edit, atau menghapus challenge.
POST /submit: Bisa submit jawaban (status 200 jika benar, 404 dan "Flag salah." jika salah).
Dengan Token Admin/Maker (Berhasil):

GET /: Bisa lihat daftar challenge (status 200).
POST /add: Berhasil menambah challenge (status 201 dan pesan "Challenge berhasil ditambahkan!").
PUT /{challenge_id}: Berhasil edit challenge (status 200 dan pesan "Challenge berhasil diperbarui!").
DELETE /{challenge_id}: Berhasil hapus challenge (status 200 dan pesan "Challenge berhasil dihapus!").
POST /submit: Bisa submit jawaban (status 200 jika benar, 404 dan "Flag salah." jika salah).
Catatan Tambahan:

Tambah challenge dengan judul atau flag yang sama akan kasih error 500 karena ada batasan unik.
Perhatikan variabel seperti {{base_url}}, {{token_maker}}, {{token_user}}, dan {{challenge_1}} yang perlu kamu ganti dengan nilai sebenarnya di aplikasi FE kamu

Tambah Challenge (POST /add):

JSON

{
    "title": "Tantangan Web Sederhana",
    "description": "Temukan flag tersembunyi di source code halaman ini.",
    "difficulty": 1,
    "flag": "flag{ini_flag_web}",
    "url": "http://contoh-web.com",
    "tags": ["web", "basic"],
    "hint": "Lihat bagian komentar di HTML."
}
Edit Challenge (PUT /{challenge_id}):

JSON

{
    "title": "Tantangan Web Sederhana (Diperbarui)",
    "description": "Temukan flag tersembunyi di source code halaman ini. Petunjuk baru ditambahkan.",
    "difficulty": 2,
    "flag": "flag{ini_flag_web_update}",
    "url": "http://contoh-web.com/baru",
    "tags": ["web", "mudah"],
    "hint": "Cari juga di file JavaScript."
}
Submit Flag (POST /submit):

JSON

{
    "flag": "flag{jawaban_user}"
}
Contoh Response Body:

Berhasil Ambil Daftar Challenge (GET /):

JSON

[
    {
        "id": "some_unique_id_1",
        "title": "Tantangan Web Sederhana",
        "description": "Temukan flag tersembunyi di source code halaman ini.",
        "difficulty": 1,
        "url": "http://contoh-web.com",
        "tags": ["web", "basic"],
        "hint": "Lihat bagian komentar di HTML."
    },
    {
        "id": "some_unique_id_2",
        "title": "Tantangan Kriptografi",
        "description": "Pecahkan pesan rahasia ini.",
        "difficulty": 3,
        "url": null,
        "tags": ["crypto"],
        "hint": "Mungkin ini enkripsi Caesar."
    }
    // ... dan seterusnya
]
Berhasil Tambah/Edit Challenge (POST /add, PUT /{challenge_id}):

JSON

{
    "message": "Challenge berhasil ditambahkan!" // atau "Challenge berhasil diperbarui!"
}
Berhasil Hapus Challenge (DELETE /{challenge_id}):

JSON

{
    "message": "Challenge berhasil dihapus!"
}


Oke, saya akan bantu buatkan dokumentasi berdasarkan Postman Collection yang Anda berikan. Dokumentasi ini akan menjelaskan cara penggunaan API untuk manajemen pengguna (users) dan otentikasi (auth).

Dokumentasi API Users

I. Informasi Umum

Nama Collection: users
Schema: https://schema.getpostman.com/json/collection/v2.1.0/collection.json
Base URL: {{base_url}} (Pastikan Anda mengganti {{base_url}} dengan URL server API Anda)
II. Daftar Endpoint

Berikut adalah daftar endpoint API yang tersedia beserta penjelasan cara penggunaannya:

1.  GET /api/users (Tanpa Token)

* **Deskripsi:** Mendapatkan daftar semua pengguna.
* **Metode:** GET
* **URL:** `{{base_url}}/api/users`
* **Otorisasi:** Tidak ada (Tanpa token)
* **Header:** Tidak ada
* **Body:** Tidak ada
* **Respon:**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "No token provided"
        }
        ```
* **Catatan:** Endpoint ini memerlukan token otentikasi. Tanpa token, server akan menolak permintaan dan mengembalikan status 403.
2.  DELETE /api/users/{user_id} (Tanpa Token)

* **Deskripsi:** Menghapus pengguna berdasarkan ID.
* **Metode:** DELETE
* **URL:** `{{base_url}}/api/users/{{user_tmp_user_id}}` (Ganti `{{user_tmp_user_id}}` dengan ID pengguna yang ingin dihapus)
* **Otorisasi:** Tidak ada (Tanpa token)
* **Header:** Tidak ada
* **Body:** Tidak ada
* **Respon:**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "No token provided"
        }
        ```
* **Catatan:** Endpoint ini memerlukan token otentikasi. Tanpa token, server akan menolak permintaan dan mengembalikan status 403.
3.  POST /api/auth/register (Tanpa Body)

* **Deskripsi:** Mendaftarkan pengguna baru.
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/register`
* **Otorisasi:** Tidak ada
* **Header:** Tidak ada
* **Body:** Kosong
* **Respon:**
    * **Status Code:** 400 Bad Request
    * **Contoh Respon:**
        ```json
        {
            "message": "Username, email, dan password harus diisi."
        }
        ```
* **Catatan:** Endpoint ini memerlukan data username, email, dan password dalam body request.
4.  POST /api/setup (Register Admin)

* **Deskripsi:** Melakukan pengaturan awal (setup) untuk membuat user root (admin).
* **Metode:** POST
* **URL:** `{{base_url}}/api/setup`
* **Otorisasi:** Tidak ada
* **Header:** Tidak ada
* **Body:**
    ```json
    {
        "username": "admin",
        "password": "admin",
        "secret": "my-secret-key"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 201 Created
    * **Contoh Respon:**
        ```json
        {
            "message": "User root berhasil dibuat!"
        }
        ```
* **Respon (Sudah Setup):**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "Setup sudah dilakukan. Tidak bisa membuat user root lagi."
        }
        ```
* **Catatan:**
    * Endpoint ini digunakan untuk membuat pengguna admin pertama kali.
    * `secret` adalah kunci rahasia yang mungkin diperlukan oleh server untuk otentikasi setup.
    * Setelah setup berhasil, endpoint ini tidak dapat digunakan lagi untuk membuat admin.
5.  POST /api/auth/register (Register User)

* **Deskripsi:** Mendaftarkan pengguna baru (selain admin awal).
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/register`
* **Otorisasi:** Tidak ada
* **Header:** Tidak ada
* **Body:**
    ```json
    {
        "username": "nama_pengguna",
        "email": "email@contoh.com",
        "password": "kata_sandi"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 201 Created (Mungkin)
    * **Contoh Respon:**
        ```json
        {
            "message": "User berhasil didaftarkan"
        }
        ```
* **Respon (Gagal):**
    * **Status Code:** 400 Bad Request (Mungkin)
    * **Contoh Respon (Username/Email sudah ada):**
        ```json
        {
            "message": "Email atau username sudah digunakan."
        }
        ```
* **Catatan:**
    * Pastikan untuk memberikan username, email, dan password yang valid.
    * Server mungkin mengembalikan pesan kesalahan jika username atau email sudah terdaftar.
6.  POST /api/auth/login (Login)

* **Deskripsi:** Melakukan login untuk mendapatkan token otentikasi.
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/login`
* **Otorisasi:** Tidak ada
* **Header:**
    * `username`: "nama_pengguna"
    * `password`: "kata_sandi"
* **Body:**
    ```json
    {
        "username": "nama_pengguna",
        "password": "kata_sandi"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Login successful",
            "token": "token_otentikasi"
        }
        ```
* **Respon (Gagal):**
    * **Status Code:** 400 Bad Request
    * **Contoh Respon:**
        ```json
        {
            "message": "Invalid credentials."
        }
        ```
* **Catatan:**
    * Gunakan username dan password yang telah terdaftar.
    * Token yang didapatkan dari respon sukses digunakan untuk otentikasi pada endpoint lain yang memerlukan otorisasi.
7.  GET /api/users (Dengan Token)

* **Deskripsi:** Mendapatkan daftar semua pengguna (memerlukan token).
* **Metode:** GET
* **URL:** `{{base_url}}/api/users`
* **Otorisasi:** Bearer Token (Gunakan token yang didapatkan dari login)
* **Header:** `Authorization: Bearer <token>` (Ganti `<token>` dengan token yang valid)
* **Body:** Tidak ada
* **Respon:**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
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
                },
                // ... data pengguna lainnya
            ]
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan token yang valid untuk mengakses data pengguna.
    * Respon berisi array objek pengguna.
    * Script Postman dalam collection ini menggunakan respon dari endpoint ini untuk menyimpan `user_id` ke dalam environment Postman.
8.  PUT /api/users/{user_id} (Edit User)

* **Deskripsi:** Mengedit data pengguna.
* **Metode:** PUT
* **URL:** `{{base_url}}/api/users/{{user_id}}` (Ganti `{{user_id}}` dengan ID pengguna yang ingin diubah)
* **Otorisasi:**
    * Tanpa Token: 403 Forbidden
    * Dengan Token User: 403 Forbidden (Access Denied)
    * Dengan Token Admin: 200 OK (Mungkin)
* **Header:**
    * `Authorization: Bearer <token>` (Ganti `<token>` dengan token yang valid)
* **Body:**
    ```json
    {
        "username": "nama_pengguna_baru",
        "password": "kata_sandi_baru",
        "role": "user/admin"
    }
    ```
* **Respon (Tanpa Token):**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "No token provided"
        }
        ```
* **Respon (Dengan Token User):**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "Access denied"
        }
        ```
* **Respon (Dengan Token Admin):**
    * **Status Code:** 200 OK (Mungkin)
    * **Contoh Respon:**
        ```json
        {
            "message": "User updated successfully"
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan otorisasi. Hanya pengguna dengan peran admin yang diizinkan untuk mengubah data pengguna lain.
    * Respon dapat bervariasi tergantung pada implementasi server.

    Tentu, berikut adalah dokumentasi untuk bagian selanjutnya dari Postman Collection Anda:

Dokumentasi API Users (Lanjutan)

Bagian ini berisi endpoint untuk mengedit pengguna, login spesifik, registrasi pengguna sementara, mendapatkan detail pengguna, dan menghapus pengguna dengan otorisasi yang berbeda.

II. Daftar Endpoint (Lanjutan)

9. PUT /api/users/{aria_user_id} (Edit aria:aria to role: maker)

* **Deskripsi:** Mengubah peran pengguna dengan username "aria" menjadi "maker".
* **Metode:** PUT
* **URL:** `{{base_url}}/api/users/{{aria_user_id}}` (Pastikan variabel `aria_user_id` telah diatur dengan benar)
* **Otorisasi:** Bearer Token (Menggunakan `{{token_admin}}`)
* **Header:** `Authorization: Bearer {{token_admin}}`
* **Body:**
    ```json
    {
      "username": "aria",
      "password": "aria",
      "role": "maker"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 200 OK (Mungkin)
    * **Contoh Respon:**
        ```json
        {
            "message": "User berhasil diperbarui."
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan token admin untuk mengubah peran pengguna.
    * Password disertakan dalam body, meskipun mungkin tidak selalu diperlukan untuk perubahan peran tergantung pada implementasi server.
10. PUT /api/users/{aria_user_id} (Edit aria:aria to user: admin)

* **Deskripsi:** Mencoba mengubah peran pengguna dengan username "aria" menjadi "admin".
* **Metode:** PUT
* **URL:** `{{base_url}}/api/users/{{aria_user_id}}`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_admin}}`)
* **Header:** `Authorization: Bearer {{token_admin}}`
* **Body:**
    ```json
    {
      "username": "admin",
      "password": "aria",
      "role": "admin"
    }
    ```
* **Respon (Gagal):**
    * **Status Code:** 400 Bad Request atau status lain yang menandakan kegagalan (Mungkin)
    * **Contoh Respon:**
        ```json
        {
            "message": "Gagal mengupdate user."
        }
        ```
* **Catatan:**
    * Endpoint ini mencoba mengubah username menjadi "admin", yang mungkin dilarang atau menyebabkan konflik.
    * Respon menunjukkan operasi pembaruan pengguna gagal.
11. PUT /api/users/{aria_user_id} (Edit aria:aria to role: admintest)

* **Deskripsi:** Mencoba mengubah peran pengguna dengan username "aria" menjadi "admintest".
* **Metode:** PUT
* **URL:** `{{base_url}}/api/users/{{aria_user_id}}`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_admin}}`)
* **Header:** `Authorization: Bearer {{token_admin}}`
* **Body:**
    ```json
    {
      "username": "aria",
      "password": "aria",
      "role": "admintest"
    }
    ```
* **Respon (Gagal):**
    * **Status Code:** 400 Bad Request atau status lain yang menandakan kegagalan (Mungkin)
    * **Contoh Respon:**
        ```json
        {
            "message": "Gagal mengupdate user."
        }
        ```
* **Catatan:**
    * Peran "admintest" kemungkinan tidak valid atau tidak diizinkan, sehingga pembaruan gagal.
12. POST /api/auth/login (Login aria:aria)

* **Deskripsi:** Melakukan login dengan username "admin" dan password "admin".
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/login`
* **Otorisasi:** Tidak ada
* **Header:**
    * `username`: "test" (Sepertinya ada kesalahan penamaan di header, seharusnya "admin")
    * `password`: "test" (Sepertinya ada kesalahan penamaan di header, seharusnya "admin")
* **Body:**
    ```json
    {
      "username": "admin",
      "password": "admin"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Login successful",
            "token": "token_otentikasi_admin"
        }
        ```
* **Catatan:**
    * Endpoint ini melakukan login sebagai pengguna "admin" dengan password "admin".
    * Script pada bagian `event` menyimpan token yang berhasil didapatkan ke dalam variabel environment `token_maker`. **Perhatikan bahwa nama variabel ini mungkin tidak sesuai (seharusnya `token_admin` atau nama lain yang relevan untuk admin).**
13. POST /api/auth/register (Register user_tmp:user_tmp)

* **Deskripsi:** Mendaftarkan pengguna baru dengan username "user\_tmp", email "user\[email address removed]", dan password "user\_tmp".
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/register`
* **Otorisasi:** Tidak ada
* **Header:** Tidak ada
* **Body:**
    ```json
    {
      "username": "user_tmp",
      "email": "user_tmp@gmail.com",
      "password": "user_tmp"
    }
    ```
* **Respon (Sukses atau Gagal):**
    * **Status Code:** 201 Created (jika berhasil) atau 400 Bad Request (jika gagal, misalnya username/email sudah ada)
    * **Contoh Respon (Berhasil):**
        ```json
        {
            "message": "User berhasil didaftarkan"
        }
        ```
    * **Contoh Respon (Gagal):**
        ```json
        {
            "message": "Email atau username sudah digunakan."
        }
        ```
* **Catatan:**
    * Endpoint ini mencoba mendaftarkan pengguna baru.
    * Script pada bagian `event` memeriksa apakah pesan respons sesuai dengan salah satu kemungkinan (berhasil atau username/email sudah ada).
14. POST /api/auth/login (Login user_tmp:user_tmp)

* **Deskripsi:** Melakukan login dengan username "user\_tmp" dan password "user\_tmp".
* **Metode:** POST
* **URL:** `{{base_url}}/api/auth/login`
* **Otorisasi:** Tidak ada
* **Header:**
    * `username`: "test" (Sepertinya ada kesalahan penamaan di header, seharusnya "user\_tmp")
    * `password`: "test" (Sepertinya ada kesalahan penamaan di header, seharusnya "user\_tmp")
* **Body:**
    ```json
    {
      "username": "user_tmp",
      "password": "user_tmp"
    }
    ```
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Login successful"
        }
        ```
* **Catatan:**
    * Endpoint ini melakukan login sebagai pengguna "user\_tmp".
15. GET /api/users (Get Users)

* **Deskripsi:** Mendapatkan daftar semua pengguna (memerlukan token pengguna biasa).
* **Metode:** GET
* **URL:** `{{base_url}}/api/users`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_user}}`)
* **Header:** `Authorization: Bearer {{token_user}}`
* **Body:** Tidak ada
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Data pengguna berhasil diambil.",
            "data": [
                // ... daftar informasi pengguna
            ]
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan token pengguna biasa untuk mengakses daftar pengguna.
    * Script pada bagian `event` mengambil ID pengguna untuk username "aria" dan "user\_tmp" dari respons dan menyimpannya ke dalam variabel environment `aria_user_id` dan `user_tmp_user_id`.
16. GET /api/users/{user_tmp_user_id} (Get Users Detail)

* **Deskripsi:** Mendapatkan detail informasi pengguna berdasarkan ID.
* **Metode:** GET
* **URL:** `{{base_url}}/api/users/{{user_tmp_user_id}}` (Pastikan variabel `user_tmp_user_id` telah diatur)
* **Otorisasi:** Bearer Token (Menggunakan `{{token_user}}`)
* **Header:** `Authorization: Bearer {{token_user}}`
* **Body:** Tidak ada
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Data user berhasil diambil.",
            "data": {
                "id": "user_id",
                "username": "user_tmp",
                "email": "user_tmp@gmail.com",
                "role": "user",
                // ... informasi pengguna lainnya
            }
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan token pengguna biasa untuk melihat detail pengguna.
17. GET /api/users/me (Get Users Me)

* **Deskripsi:** Mendapatkan detail informasi pengguna yang sedang terotentikasi.
* **Metode:** GET
* **URL:** `{{base_url}}/api/users/me`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_user}}`)
* **Header:** `Authorization: Bearer {{token_user}}`
* **Body:** Tidak ada
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "Data user berhasil diambil.",
            "data": {
                "id": "user_id_pengguna_saat_ini",
                "username": "nama_pengguna_saat_ini",
                "email": "email_pengguna_saat_ini",
                "role": "user",
                // ... informasi pengguna lainnya
            }
        }
        ```
* **Catatan:**
    * Endpoint ini memerlukan token pengguna biasa untuk mendapatkan informasi profil pengguna yang sedang login.
18. DELETE /api/users/{user_tmp_user_id} (Delete user_tmp | with token user)

* **Deskripsi:** Mencoba menghapus pengguna dengan ID `user_tmp_user_id` menggunakan token pengguna biasa.
* **Metode:** DELETE
* **URL:** `{{base_url}}/api/users/{{user_tmp_user_id}}`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_user}}`)
* **Header:** `Authorization: Bearer {{token_user}}`
* **Body:** Tidak ada
* **Respon (Gagal - Access Denied):**
    * **Status Code:** 403 Forbidden
    * **Contoh Respon:**
        ```json
        {
            "message": "Access denied"
        }
        ```
* **Catatan:**
    * Pengguna biasa umumnya tidak diizinkan untuk menghapus pengguna lain.
19. DELETE /api/users/{user_tmp_user_id} (Delete user_tmp | with token admin)

* **Deskripsi:** Menghapus pengguna dengan ID `user_tmp_user_id` menggunakan token admin.
* **Metode:** DELETE
* **URL:** `{{base_url}}/api/users/{{user_tmp_user_id}}`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_admin}}`)
* **Header:** `Authorization: Bearer {{token_admin}}`
* **Body:** Tidak ada
* **Respon (Sukses):**
    * **Status Code:** 200 OK
    * **Contoh Respon:**
        ```json
        {
            "message": "User berhasil dihapus."
        }
        ```
* **Catatan:**
    * Hanya admin yang diizinkan untuk menghapus pengguna.
20. footer

* **Deskripsi:** Kemungkinan merupakan bagian penutup atau tidak ada tindakan spesifik.
* **Metode:** GET
* **URL:** `{{base_url}}/api/users`
* **Otorisasi:** Bearer Token (Menggunakan `{{token_user}}`)
* **Header:** `Authorization: Bearer {{token_user}}`
* **Body:** Tidak ada
* **Respon:** Tidak ada informasi spesifik mengenai respons untuk bagian ini. Kemung