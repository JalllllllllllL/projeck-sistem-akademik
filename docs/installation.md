# Instalasi Sistem Absensi dan Akademik Siswa

## Backend

1. Buka terminal di folder `backend`
2. Jalankan `npm install`
3. Salin `.env.example` menjadi `.env`
4. Atur variabel: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
5. Buat database MySQL menggunakan `docs/schema.sql`
6. Jalankan server: `npm run dev`

## Frontend

1. Buka terminal di folder `frontend`
2. Jalankan `npm install`
3. Jalankan `npm run dev`
4. Buka browser ke `http://localhost:5173`

## Deployment

- Frontend: deploy folder `frontend` ke Vercel
- Backend: deploy folder `backend` ke Railway atau Render
- Pastikan environment variable di platform deployment sama dengan `.env`
