const db = require('../db');

const getAbsensiBySiswaId = async (siswaId) => {
  const [rows] = await db.query('SELECT * FROM absensi WHERE siswa_id = ? ORDER BY tanggal DESC, jam DESC', [siswaId]);
  return rows;
};

const createAbsensi = async ({ siswaId, tanggal, jam, status, keterangan }) => {
  const [result] = await db.query(
    'INSERT INTO absensi (siswa_id, tanggal, jam, status, keterangan) VALUES (?, ?, ?, ?, ?)',
    [siswaId, tanggal, jam, status, keterangan]
  );
  return result.insertId;
};

const countAbsensiBySiswaId = async (siswaId) => {
  const [rows] = await db.query(
    `SELECT
      SUM(status='Hadir') AS hadir,
      SUM(status='Izin') AS izin,
      SUM(status='Sakit') AS sakit,
      SUM(status='Alpha') AS alpha
      FROM absensi WHERE siswa_id = ?`,
    [siswaId]
  );
  return rows[0];
};

module.exports = { getAbsensiBySiswaId, createAbsensi, countAbsensiBySiswaId };
