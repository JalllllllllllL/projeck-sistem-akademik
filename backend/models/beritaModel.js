const db = require('../db');

const getAllBerita = async () => {
  const [rows] = await db.query('SELECT * FROM berita ORDER BY tanggal_publikasi DESC');
  return rows;
};

const getLatestBerita = async (limit = 3) => {
  const [rows] = await db.query('SELECT * FROM berita ORDER BY tanggal_publikasi DESC LIMIT ?', [limit]);
  return rows;
};

const createBerita = async ({ judul, gambar, isi, penulis, tanggalPublikasi }) => {
  const [result] = await db.query(
    'INSERT INTO berita (judul, gambar, isi, penulis, tanggal_publikasi) VALUES (?, ?, ?, ?, ?)',
    [judul, gambar, isi, penulis, tanggalPublikasi]
  );
  return result.insertId;
};

const updateBerita = async (id, { judul, gambar, isi, penulis, tanggalPublikasi }) => {
  const [result] = await db.query(
    'UPDATE berita SET judul = ?, gambar = ?, isi = ?, penulis = ?, tanggal_publikasi = ? WHERE id = ?',
    [judul, gambar, isi, penulis, tanggalPublikasi, id]
  );
  return result;
};

const deleteBerita = async (id) => {
  const [result] = await db.query('DELETE FROM berita WHERE id = ?', [id]);
  return result;
};

module.exports = { getAllBerita, getLatestBerita, createBerita, updateBerita, deleteBerita };
