const authService = require('../services/authService');

const registerSiswa = async (req, res, next) => {
  try {
    const result = await authService.registerSiswa(req.body);
    res.status(201).json({ message: 'Registrasi siswa berhasil', user: result });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const registerGuru = async (req, res, next) => {
  try {
    const result = await authService.registerGuru(req.body);
    res.status(201).json({ message: 'Registrasi guru berhasil', user: result });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const loginSiswa = async (req, res, next) => {
  try {
    const result = await authService.loginSiswa(req.body);
    res.json(result);
  } catch (error) {
    next({ status: 401, message: error.message });
  }
};

const loginGuru = async (req, res, next) => {
  try {
    const result = await authService.loginGuru(req.body);
    res.json(result);
  } catch (error) {
    next({ status: 401, message: error.message });
  }
};

module.exports = { registerSiswa, registerGuru, loginSiswa, loginGuru };
