const siswaService = require('../services/siswaService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await siswaService.getDashboard(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getJadwal = async (req, res, next) => {
  try {
    const data = await siswaService.getJadwal(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getNilai = async (req, res, next) => {
  try {
    const data = await siswaService.getNilai(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getProfil = async (req, res, next) => {
  try {
    const data = await siswaService.getProfil(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const updateProfil = async (req, res, next) => {
  try {
    const data = await siswaService.updateProfil(req.user.userId, req.body);
    res.json({ message: 'Profil siswa diperbarui', data });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const changePassword = async (req, res, next) => {
  try {
    await siswaService.changePassword(req.user.userId, req.body.oldPassword, req.body.newPassword);
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getAbsensiRiwayat = async (req, res, next) => {
  try {
    const data = await siswaService.getAbsensiRiwayat(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getBerita = async (req, res, next) => {
  try {
    const data = await siswaService.getBerita();
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

module.exports = { getDashboard, getJadwal, getNilai, getProfil, updateProfil, changePassword, getAbsensiRiwayat, getBerita };
