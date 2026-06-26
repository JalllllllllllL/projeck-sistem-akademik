const guruService = require('../services/guruService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await guruService.getDashboard(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getJadwalMengajar = async (req, res, next) => {
  try {
    const data = await guruService.getJadwalMengajar(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getKelasDetail = async (req, res, next) => {
  try {
    const kelasId = req.params.kelasId;
    const data = await guruService.getKelasDetail(kelasId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getNilaiSiswa = async (req, res, next) => {
  try {
    const siswaId = req.params.siswaId;
    const data = await guruService.getNilaiSiswa(siswaId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const inputNilai = async (req, res, next) => {
  try {
    const id = await guruService.inputNilai(req.body);
    res.status(201).json({ message: 'Nilai berhasil disimpan', id });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const editNilai = async (req, res, next) => {
  try {
    const id = await guruService.editNilai(req.params.nilaiId, req.body);
    res.json({ message: 'Nilai berhasil diperbarui', id });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const deleteNilai = async (req, res, next) => {
  try {
    await guruService.deleteNilai(req.params.nilaiId);
    res.json({ message: 'Nilai berhasil dihapus' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const catatAbsensi = async (req, res, next) => {
  try {
    const id = await guruService.catatAbsensi(req.body);
    res.status(201).json({ message: 'Absensi berhasil dicatat', id });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getBerita = async (req, res, next) => {
  try {
    const data = await guruService.getBerita();
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const getProfil = async (req, res, next) => {
  try {
    const data = await guruService.getProfil(req.user.userId);
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const updateProfil = async (req, res, next) => {
  try {
    const data = await guruService.updateProfil(req.user.userId, req.body);
    res.json({ message: 'Profil guru diperbarui', data });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const changePassword = async (req, res, next) => {
  try {
    await guruService.changePassword(req.user.userId, req.body.oldPassword, req.body.newPassword);
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

module.exports = { getDashboard, getJadwalMengajar, getKelasDetail, getNilaiSiswa, inputNilai, editNilai, deleteNilai, catatAbsensi, getBerita, getProfil, updateProfil, changePassword };
