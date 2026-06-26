const siswaModel = require('../models/siswaModel');
const jadwalModel = require('../models/jadwalModel');
const absensiModel = require('../models/absensiModel');
const nilaiModel = require('../models/nilaiModel');
const rankingModel = require('../models/rankingModel');
const beritaModel = require('../models/beritaModel');
const userModel = require('../models/userModel');

const getDashboard = async (userId) => {
  const siswa = await siswaModel.findSiswaByUserId(userId);
  if (!siswa) throw new Error('Siswa tidak ditemukan');

  const absensiSummary = await absensiModel.countAbsensiBySiswaId(siswa.id);
  const nilai = await nilaiModel.getNilaiBySiswaId(siswa.id);
  const ranking = await rankingModel.getRankingBySiswaId(siswa.id);
  const jadwal = await jadwalModel.getJadwalSiswa(siswa.kelas);
  const berita = await beritaModel.getLatestBerita(3);

  return {
    siswa,
    absensiSummary,
    nilai,
    ranking,
    jadwal,
    berita
  };
};

const getJadwal = async (userId) => {
  const siswa = await siswaModel.findSiswaByUserId(userId);
  if (!siswa) throw new Error('Siswa tidak ditemukan');
  return await jadwalModel.getJadwalSiswa(siswa.kelas);
};

const getNilai = async (userId) => {
  const siswa = await siswaModel.findSiswaByUserId(userId);
  if (!siswa) throw new Error('Siswa tidak ditemukan');
  return await nilaiModel.getNilaiBySiswaId(siswa.id);
};

const getProfil = async (userId) => {
  return await siswaModel.findSiswaByUserId(userId);
};

const updateProfil = async (userId, data) => {
  const siswa = await siswaModel.findSiswaByUserId(userId);
  if (!siswa) throw new Error('Siswa tidak ditemukan');
  await siswaModel.updateSiswa(siswa.id, data);
  return await siswaModel.findSiswaByUserId(userId);
};

const changePassword = async (userId, oldPassword, newPassword) => {
  return await userModel.changePassword(userId, oldPassword, newPassword);
};

const getAbsensiRiwayat = async (userId) => {
  const siswa = await siswaModel.findSiswaByUserId(userId);
  if (!siswa) throw new Error('Siswa tidak ditemukan');
  return await absensiModel.getAbsensiBySiswaId(siswa.id);
};

const getBerita = async () => {
  return await beritaModel.getAllBerita();
};

module.exports = { getDashboard, getJadwal, getNilai, getProfil, updateProfil, changePassword, getAbsensiRiwayat, getBerita };
