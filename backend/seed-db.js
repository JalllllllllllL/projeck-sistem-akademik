const bcrypt = require('bcrypt');
const { query } = require('./db');

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

  console.log('Seed data berhasil ditambahkan.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Gagal menambahkan seed data:', err.message);
  process.exit(1);
});