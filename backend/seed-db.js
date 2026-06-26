const bcrypt = require('bcrypt');
const { query, db: sqliteDb } = require('./db');

const run = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'guru1@example.com', role: 'guru' },
    { email: 'guru2@example.com', role: 'guru' },
    { email: 'siswa1@example.com', role: 'siswa' },
    { email: 'siswa2@example.com', role: 'siswa' },
    { email: 'siswa3@example.com', role: 'siswa' }
  ];

  for (const user of users) {
    const [existingRows] = await query('SELECT id FROM users WHERE email = ?', [user.email]);
    if (existingRows.length === 0) {
      await query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [user.email, passwordHash, user.role]
      );
    }
  }

  const getUserId = async (email) => {
    const [rows] = await query('SELECT id FROM users WHERE email = ?', [email]);
    return rows[0]?.id;
  };

  const guruData = [
    { email: 'guru1@example.com', nama: 'Bapak Ahmad', nip: 'G1001', mataPelajaran: 'Matematika' },
    { email: 'guru2@example.com', nama: 'Ibu Siti', nip: 'G1002', mataPelajaran: 'Bahasa Indonesia' }
  ];

  for (const guru of guruData) {
    const userId = await getUserId(guru.email);
    if (!userId) continue;
    const [existingRows] = await query('SELECT id FROM guru WHERE nip = ?', [guru.nip]);
    if (existingRows.length === 0) {
      await query(
        'INSERT INTO guru (user_id, nama, nip, mata_pelajaran) VALUES (?, ?, ?, ?)',
        [userId, guru.nama, guru.nip, guru.mataPelajaran]
      );
    }
  }

  const siswaData = [
    { email: 'siswa1@example.com', nama: 'Andi', nis: 'S1001', kelas: '10A', jenisKelamin: 'Laki-laki' },
    { email: 'siswa2@example.com', nama: 'Sari', nis: 'S1002', kelas: '10A', jenisKelamin: 'Perempuan' },
    { email: 'siswa3@example.com', nama: 'Budi', nis: 'S1003', kelas: '11B', jenisKelamin: 'Laki-laki' }
  ];

  for (const siswa of siswaData) {
    const userId = await getUserId(siswa.email);
    if (!userId) continue;
    const [existingRows] = await query('SELECT id FROM siswa WHERE nis = ?', [siswa.nis]);
    if (existingRows.length === 0) {
      await query(
        'INSERT INTO siswa (user_id, nama, nis, kelas, jenis_kelamin) VALUES (?, ?, ?, ?, ?)',
        [userId, siswa.nama, siswa.nis, siswa.kelas, siswa.jenisKelamin]
      );
    }
  }

  const mataPelajaranData = ['Matematika', 'Bahasa Indonesia', 'IPA'];
  for (const nama of mataPelajaranData) {
    const [existingRows] = await query('SELECT id FROM mata_pelajaran WHERE nama = ?', [nama]);
    if (existingRows.length === 0) {
      await query('INSERT INTO mata_pelajaran (nama) VALUES (?)', [nama]);
    }
  }

  const [mpRows] = await query('SELECT id, nama FROM mata_pelajaran');
  const mataMap = mpRows.reduce((acc, row) => ({ ...acc, [row.nama]: row.id }), {});

  const [guruRows] = await query('SELECT id, nip FROM guru');
  const guruMap = guruRows.reduce((acc, row) => ({ ...acc, [row.nip]: row.id }), {});

  const jadwalData = [
    { kelas: '10A', hari: 'Senin', jam: '08:00', mataPelajaran: 'Matematika', nip: 'G1001' },
    { kelas: '10A', hari: 'Selasa', jam: '09:30', mataPelajaran: 'Bahasa Indonesia', nip: 'G1002' },
    { kelas: '11B', hari: 'Senin', jam: '10:00', mataPelajaran: 'IPA', nip: 'G1001' }
  ];

  for (const jadwal of jadwalData) {
    const guruId = guruMap[jadwal.nip];
    const mataPelajaranId = mataMap[jadwal.mataPelajaran];
    if (!guruId || !mataPelajaranId) continue;
    const [rows] = await query(
      'SELECT id FROM jadwal WHERE kelas = ? AND hari = ? AND jam = ? AND mata_pelajaran_id = ? AND guru_id = ?',
      [jadwal.kelas, jadwal.hari, jadwal.jam, mataPelajaranId, guruId]
    );
    if (!rows.length) {
      await query(
        'INSERT INTO jadwal (kelas, hari, jam, mata_pelajaran_id, guru_id) VALUES (?, ?, ?, ?, ?)',
        [jadwal.kelas, jadwal.hari, jadwal.jam, mataPelajaranId, guruId]
      );
    }
  }

  const [siswaMapRows] = await query('SELECT id, nis FROM siswa');
  const siswaMap = siswaMapRows.reduce((acc, row) => ({ ...acc, [row.nis]: row.id }), {});

  const nilaiData = [
    { nis: 'S1001', tugas: 85, uts: 80, uas: 90 },
    { nis: 'S1002', tugas: 78, uts: 82, uas: 88 },
    { nis: 'S1003', tugas: 90, uts: 85, uas: 92 }
  ];

  for (const nilai of nilaiData) {
    const siswaId = siswaMap[nilai.nis];
    if (!siswaId) continue;
    const [existingRows] = await query('SELECT id FROM nilai WHERE siswa_id = ?', [siswaId]);
    if (existingRows.length === 0) {
      await query('INSERT INTO nilai (siswa_id, tugas, uts, uas) VALUES (?, ?, ?, ?)',
        [siswaId, nilai.tugas, nilai.uts, nilai.uas]);
    }
  }

  const absensiData = [
    { nis: 'S1001', tanggal: '2026-06-01', jam: '08:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { nis: 'S1001', tanggal: '2026-06-02', jam: '08:00', status: 'Izin', keterangan: 'Sakit' },
    { nis: 'S1002', tanggal: '2026-06-01', jam: '08:00', status: 'Hadir', keterangan: '' },
    { nis: 'S1003', tanggal: '2026-06-01', jam: '10:00', status: 'Hadir', keterangan: '' }
  ];

  for (const absensi of absensiData) {
    const siswaId = siswaMap[absensi.nis];
    if (!siswaId) continue;
    const [rows] = await query(
      'SELECT id FROM absensi WHERE siswa_id = ? AND tanggal = ? AND jam = ? AND status = ?',
      [siswaId, absensi.tanggal, absensi.jam, absensi.status]
    );
    if (!rows.length) {
      await query(
        'INSERT INTO absensi (siswa_id, tanggal, jam, status, keterangan) VALUES (?, ?, ?, ?, ?)',
        [siswaId, absensi.tanggal, absensi.jam, absensi.status, absensi.keterangan]
      );
    }
  }

  const beritaData = [
    { judul: 'Pembukaan KBM Semester Baru', gambar: '', isi: 'Selamat datang di semester baru. Jadwal pelajaran dan informasi penting sudah tersedia.', penulis: 'Admin Sekolah', tanggalPublikasi: '2026-06-25 08:00:00' },
    { judul: 'Lomba Seni dan Olahraga', gambar: '', isi: 'Jangan lewatkan lomba seni dan olahraga pekan depan. Pendaftaran dibuka sekarang.', penulis: 'Panitia OSIS', tanggalPublikasi: '2026-06-24 10:30:00' }
  ];

  for (const berita of beritaData) {
    const [rows] = await query('SELECT id FROM berita WHERE judul = ?', [berita.judul]);
    if (!rows.length) {
      await query('INSERT INTO berita (judul, gambar, isi, penulis, tanggal_publikasi) VALUES (?, ?, ?, ?, ?)',
        [berita.judul, berita.gambar, berita.isi, berita.penulis, berita.tanggalPublikasi]);
    }
  }

  console.log('Seed data berhasil ditambahkan.');
  sqliteDb.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Gagal menambahkan seed data:', err.message);
  process.exit(1);
});
