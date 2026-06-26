const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register-siswa', authController.registerSiswa);
router.post('/register-guru', authController.registerGuru);
router.post('/login-siswa', authController.loginSiswa);
router.post('/login-guru', authController.loginGuru);

module.exports = router;
