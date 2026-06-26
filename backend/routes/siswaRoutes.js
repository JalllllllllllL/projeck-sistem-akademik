const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const siswaController = require('../controllers/siswaController');

router.use(authMiddleware, requireRole('siswa'));

router.get('/dashboard', siswaController.getDashboard);
router.get('/jadwal', siswaController.getJadwal);
router.get('/nilai', siswaController.getNilai);
router.get('/profil', siswaController.getProfil);
router.put('/profil', siswaController.updateProfil);
router.put('/change-password', siswaController.changePassword);
router.get('/absensi', siswaController.getAbsensiRiwayat);
router.get('/berita', siswaController.getBerita);

module.exports = router;
