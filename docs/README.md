# Sistem Absensi dan Akademik Siswa

## Deskripsi Proyek

Sistem Absensi dan Akademik Siswa adalah aplikasi fullstack yang mengelola data siswa, guru, absensi, nilai, ranking, dan berita sekolah. Aplikasi ini menggunakan frontend Svelte dan backend Node.js + Express dengan database MySQL/MariaDB.

## Fitur Utama

- Registrasi dan login siswa/guru
- Dashboard siswa dan guru
- Jadwal pelajaran / jadwal mengajar
- Input dan manajemen nilai
- Manajemen ranking kelas dengan bobot akademik dan keteladanan
- Pencatatan absensi siswa
- Berita sekolah
- Autentikasi JWT dan hashing password bcrypt
- Frontend responsif tanpa framework CSS eksternal

## Struktur Folder

- backend/
  - controllers/
  - middleware/
  - models/
  - routes/
  - services/
  - db.js
  - server.js
- frontend/
  - src/
    - components/
    - routes/
    - stores/
    - app.css
    - App.svelte
    - main.js

## Instalasi Backend

1. Masuk ke folder backend
2. Salin `.env.example` menjadi `.env`
3. Atur koneksi MySQL
4. Jalankan `npm install`
5. Jalankan `npm run dev`

## Instalasi Frontend

1. Masuk ke folder frontend
2. Jalankan `npm install`
3. Jalankan `npm run dev`

## Database

Gunakan MySQL atau MariaDB. Siapkan database `sistem_absensi_akademik` dan jalankan skema SQL pada file `docs/schema.sql`.

## Deployment

- Frontend: deploy ke Vercel dari folder `frontend`
- Backend: deploy ke Railway atau Render dengan environment variable sesuai `.env`

## REST API

Dokumentasi endpoint lengkap disimpan di `docs/api.md`.
