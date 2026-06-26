# Dokumentasi Presentasi UAS

## Judul

Sistem Absensi dan Akademik Siswa

## Latar Belakang

- Kebutuhan digitalisasi absensi dan pengelolaan nilai di sekolah
- Mempermudah guru dan siswa dalam memantau kehadiran, nilai, dan ranking kelas

## Tujuan

- Mengembangkan aplikasi fullstack menggunakan Svelte dan Node.js
- Menerapkan arsitektur MVC, REST API, dan autentikasi JWT
- Membuat sistem nilai terintegrasi dengan ranking kelas

## Fitur

1. Registrasi dan login Siswa/Guru
2. Dashboard siswa dengan statistik kehadiran dan nilai
3. Dashboard guru dengan ringkasan kelas dan jadwal mengajar
4. Input nilai dan manajemen ranking kelas
5. Pencatatan absensi (Hadir, Izin, Sakit, Alpha)
6. Berita sekolah publik

## Arsitektur

- Frontend: Svelte + CSS custom, responsive
- Backend: Node.js + Express + MySQL
- Database: MySQL dengan relasi tabel `users`, `siswa`, `guru`, `jadwal`, `absensi`, `nilai`, `ranking`, `berita`
- Autentikasi: JWT
- Password hash: bcrypt

## Demonstrasi

- Registrasi siswa dan guru
- Login siswa/guru
- Menampilkan dashboard dan data nilai
- Guru input nilai dan catat absensi
- Hitung ulang ranking kelas
- Tampilan berita sekolah

## Kesimpulan

- Sistem mendukung dua role: Siswa dan Guru
- Data tersimpan secara relasional dan terproteksi
- Antarmuka responsif dan mudah digunakan

## Catatan Teknis

- Deploy frontend ke Vercel
- Deploy backend ke Railway/Render
- URL API bisa dikonfigurasi pada `frontend/src/routes`
