const guruModel = require('../models/guruModel');
const jadwalModel = require('../models/jadwalModel');
const nilaiModel = require('../models/nilaiModel');
const siswaModel = require('../models/siswaModel');
const absensiModel = require('../models/absensiModel');
const rankingModel = require('../models/rankingModel');
const beritaModel = require('../models/beritaModel');
const userModel = require('../models/userModel');

const getDashboard = async (userId) => {
  const guru = await guruModel.findGuruByUserId(userId);
  if (!guru) throw new Error('Guru tidak ditemukan');

  const jadwal = await jadwalModel.getJadwalGuru(guru.id);
  const kelasDiajar = [...new Set(jadwal.map((item) => item.kelas))];
  const jumlahSiswa = await siswaModel.countSiswaByKelasList(kelasDiajar);
  const berita = await beritaModel.getLatestBerita(3);

  return {
    guru,
    jadwal,
    jumlahKelas: kelasDiajar.length,
    jumlahSiswa,
    berita
  };
};

const getJadwalMengajar = async (userId) => {
  const guru = await guruModel.findGuruByUserId(userId);
  if (!guru) throw new Error('Guru tidak ditemukan');
  return await jadwalModel.getJadwalGuru(guru.id);
};

const getKelasDetail = async (kelasId) => {
  return await siswaModel.findSiswaByKelas(kelasId);
};

const getNilaiSiswa = async (siswaId) => {
  return await nilaiModel.getNilaiBySiswaId(siswaId);
};

const inputNilai = async (data) => {
  return await nilaiModel.upsertNilai(data);
};

const editNilai = async (nilaiId, data) => {
  return await nilaiModel.updateNilaiById(nilaiId, data);
};

const deleteNilai = async (nilaiId) => {
  return await nilaiModel.deleteNilaiById(nilaiId);
};

const catatAbsensi = async (data) => {
  return await absensiModel.createAbsensi(data);
};

const getBerita = async () => {
  return await beritaModel.getAllBerita();
};

const getProfil = async (userId) => {
  return await guruModel.findGuruByUserId(userId);
};

const updateProfil = async (userId, data) => {
  const guru = await guruModel.findGuruByUserId(userId);
  if (!guru) throw new Error('Guru tidak ditemukan');
  await guruModel.updateGuru(guru.id, data);
  return await guruModel.findGuruByUserId(userId);
};

const changePassword = async (userId, oldPassword, newPassword) => {
  return await userModel.changePassword(userId, oldPassword, newPassword);
};

module.exports = { getDashboard, getJadwalMengajar, getKelasDetail, getNilaiSiswa, inputNilai, editNilai, deleteNilai, catatAbsensi, getBerita, getProfil, updateProfil, changePassword };
