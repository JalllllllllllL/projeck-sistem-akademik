const beritaModel = require('../models/beritaModel');

const getAllBerita = async (req, res, next) => {
  try {
    const berita = await beritaModel.getAllBerita();
    res.json(berita);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const createBerita = async (req, res, next) => {
  try {
    const id = await beritaModel.createBerita(req.body);
    res.status(201).json({ message: 'Berita berhasil ditambahkan', id });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const updateBerita = async (req, res, next) => {
  try {
    await beritaModel.updateBerita(req.params.id, req.body);
    res.json({ message: 'Berita berhasil diperbarui' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const deleteBerita = async (req, res, next) => {
  try {
    await beritaModel.deleteBerita(req.params.id);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

module.exports = { getAllBerita, createBerita, updateBerita, deleteBerita };
