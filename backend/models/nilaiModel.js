const db = require('../db');

const getNilaiBySiswaId = async (siswaId) => {
  const [rows] = await db.query(
    `SELECT n.id, n.siswa_id, n.tugas, n.uts, n.uas, 
      ROUND((0.3*n.tugas + 0.3*n.uts + 0.4*n.uas), 2) AS nilai_akhir
      FROM nilai n WHERE n.siswa_id = ?`,
    [siswaId]
  );
  return rows[0];
};

const getNilaiForClass = async (kelas) => {
  const [rows] = await db.query(
    `SELECT n.*, s.nama, s.kelas,
      ROUND((0.3*n.tugas + 0.3*n.uts + 0.4*n.uas), 2) AS nilai_akhir
      FROM nilai n 
      JOIN siswa s ON n.siswa_id = s.id
      WHERE s.kelas = ?`,
    [kelas]
  );
  return rows;
};

const upsertNilai = async ({ siswaId, tugas, uts, uas }) => {
  const [existing] = await db.query('SELECT id FROM nilai WHERE siswa_id = ?', [siswaId]);
  if (existing.length) {
    await db.query(
      'UPDATE nilai SET tugas = ?, uts = ?, uas = ?, updated_at = NOW() WHERE siswa_id = ?',
      [tugas, uts, uas, siswaId]
    );
    return existing[0].id;
  }
  const [result] = await db.query(
    'INSERT INTO nilai (siswa_id, tugas, uts, uas, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [siswaId, tugas, uts, uas]
  );
  return result.insertId;
};

const updateNilaiById = async (id, { tugas, uts, uas }) => {
  const [result] = await db.query('UPDATE nilai SET tugas = ?, uts = ?, uas = ?, updated_at = NOW() WHERE id = ?', [tugas, uts, uas, id]);
  return result;
};

const deleteNilaiById = async (id) => {
  const [result] = await db.query('DELETE FROM nilai WHERE id = ?', [id]);
  return result;
};

module.exports = { getNilaiBySiswaId, getNilaiForClass, upsertNilai, updateNilaiById, deleteNilaiById };
