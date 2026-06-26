const db = require('../db');

const createGuru = async (userId, nama, nip, mataPelajaran) => {
  const [result] = await db.query(
    'INSERT INTO guru (user_id, nama, nip, mata_pelajaran) VALUES (?, ?, ?, ?)',
    [userId, nama, nip, mataPelajaran]
  );
  return result.insertId;
};

const findGuruByNIP = async (nip) => {
  const [rows] = await db.query(
    'SELECT g.*, u.email, u.password FROM guru g JOIN users u ON g.user_id = u.id WHERE g.nip = ?',
    [nip]
  );
  return rows[0];
};

const findGuruByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT g.*, u.email FROM guru g JOIN users u ON g.user_id = u.id WHERE g.user_id = ?',
    [userId]
  );
  return rows[0];
};

const updateGuru = async (guruId, { nama, mataPelajaran }) => {
  await db.query('UPDATE guru SET nama = ?, mata_pelajaran = ? WHERE id = ?', [nama, mataPelajaran, guruId]);
};

module.exports = { createGuru, findGuruByNIP, findGuruByUserId, updateGuru };
