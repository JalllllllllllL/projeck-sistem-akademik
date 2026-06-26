const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const guruController = require('../controllers/guruController');

router.use(authMiddleware, requireRole('guru'));

router.get('/dashboard', guruController.getDashboard);
router.get('/jadwal', guruController.getJadwalMengajar);
router.get('/kelas/:kelasId', guruController.getKelasDetail);
router.get('/nilai/:siswaId', guruController.getNilaiSiswa);
router.post('/nilai', guruController.inputNilai);
router.put('/nilai/:nilaiId', guruController.editNilai);
router.delete('/nilai/:nilaiId', guruController.deleteNilai);
router.put('/absensi', guruController.catatAbsensi);
router.get('/berita', guruController.getBerita);
router.get('/profil', guruController.getProfil);
router.put('/profil', guruController.updateProfil);
router.put('/change-password', guruController.changePassword);

module.exports = router;
