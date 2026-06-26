# Dokumentasi REST API

## Autentikasi

- POST /api/auth/register-siswa
  - body: { nama, nis, email, password, kelas, jenisKelamin }
- POST /api/auth/register-guru
  - body: { nama, nip, email, password, mataPelajaran }
- POST /api/auth/login-siswa
  - body: { nis, password }
- POST /api/auth/login-guru
  - body: { nip, password }

## Siswa (JWT Protected)

- GET /api/siswa/dashboard
- GET /api/siswa/jadwal
- GET /api/siswa/nilai
- GET /api/siswa/profil
- PUT /api/siswa/profil
- PUT /api/siswa/change-password
- GET /api/siswa/absensi
- GET /api/siswa/berita

## Guru (JWT Protected)

- GET /api/guru/dashboard
- GET /api/guru/jadwal
- GET /api/guru/kelas/:kelasId
- GET /api/guru/nilai/:siswaId
- POST /api/guru/nilai
- PUT /api/guru/nilai/:nilaiId
- DELETE /api/guru/nilai/:nilaiId
- PUT /api/guru/absensi
- GET /api/guru/berita
- GET /api/guru/profil
- PUT /api/guru/profil
- PUT /api/guru/change-password

## Berita (Public + Protected)

- GET /api/berita
- POST /api/berita
- PUT /api/berita/:id
- DELETE /api/berita/:id

## Ranking (JWT Protected)

- GET /api/ranking
- PUT /api/ranking/weights
- POST /api/ranking/recalculate
