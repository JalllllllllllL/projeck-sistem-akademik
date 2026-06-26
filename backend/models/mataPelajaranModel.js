const db = require('../db');

const getAllMataPelajaran = async () => {
  const [rows] = await db.query('SELECT * FROM mata_pelajaran');
  return rows;
};

const findMataPelajaranById = async (id) => {
  const [rows] = await db.query('SELECT * FROM mata_pelajaran WHERE id = ?', [id]);
  return rows[0];
};

const createMataPelajaran = async (nama) => {
  const [result] = await db.query('INSERT INTO mata_pelajaran (nama) VALUES (?)', [nama]);
  return result.insertId;
};

module.exports = { getAllMataPelajaran, findMataPelajaranById, createMataPelajaran };
