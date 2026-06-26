const db = require('../db');

const createSiswa = async (userId, nama, nis, kelas, jenisKelamin) => {
  const [result] = await db.query(
    'INSERT INTO siswa (user_id, nama, nis, kelas, jenis_kelamin) VALUES (?, ?, ?, ?, ?)',
    [userId, nama, nis, kelas, jenisKelamin]
  );
  return result.insertId;
};

const findSiswaByNIS = async (nis) => {
  const [rows] = await db.query(
    'SELECT s.*, u.email, u.password FROM siswa s JOIN users u ON s.user_id = u.id WHERE s.nis = ?',
    [nis]
  );
  return rows[0];
};

const findSiswaByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT s.*, u.email FROM siswa s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?',
    [userId]
  );
  return rows[0];
};

const updateSiswa = async (siswaId, { nama, kelas, jenisKelamin }) => {
  await db.query('UPDATE siswa SET nama = ?, kelas = ?, jenis_kelamin = ? WHERE id = ?', [nama, kelas, jenisKelamin, siswaId]);
};

const findSiswaByKelas = async (kelas) => {
  const [rows] = await db.query('SELECT * FROM siswa WHERE kelas = ?', [kelas]);
  return rows;
};

const getAllSiswa = async () => {
  const [rows] = await db.query('SELECT * FROM siswa');
  return rows;
};

const countSiswaByKelasList = async (kelasList) => {
  if (!kelasList || !kelasList.length) return 0;
  const [rows] = await db.query(
    `SELECT COUNT(*) AS jumlah FROM siswa WHERE kelas IN (${kelasList.map(() => '?').join(',')})`,
    kelasList
  );
  return rows[0].jumlah;
};

module.exports = { createSiswa, findSiswaByNIS, findSiswaByUserId, updateSiswa, findSiswaByKelas, getAllSiswa, countSiswaByKelasList };
