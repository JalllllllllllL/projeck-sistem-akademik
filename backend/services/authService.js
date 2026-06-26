const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const siswaModel = require('../models/siswaModel');
const guruModel = require('../models/guruModel');

const createToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const registerSiswa = async ({ nama, nis, email, password, kelas, jenisKelamin }) => {
  const existing = await userModel.findUserByEmail(email);
  if (existing) {
    throw new Error('Email sudah terdaftar');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser(email, passwordHash, 'siswa');
  await siswaModel.createSiswa(userId, nama, nis, kelas, jenisKelamin);
  return { userId, email, role: 'siswa' };
};

const registerGuru = async ({ nama, nip, email, password, mataPelajaran }) => {
  const existing = await userModel.findUserByEmail(email);
  if (existing) {
    throw new Error('Email sudah terdaftar');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser(email, passwordHash, 'guru');
  await guruModel.createGuru(userId, nama, nip, mataPelajaran);
  return { userId, email, role: 'guru' };
};

const loginSiswa = async ({ nis, password }) => {
  const siswa = await siswaModel.findSiswaByNIS(nis);
  if (!siswa) throw new Error('NIS tidak ditemukan');
  const isValid = await bcrypt.compare(password, siswa.password || siswa.password_hash || siswa.passwordHash);
  const user = { id: siswa.user_id, role: 'siswa', email: siswa.email };
  if (!isValid) throw new Error('Kredensial tidak valid');
  return { token: createToken(user), user };
};

const loginGuru = async ({ nip, password }) => {
  const guru = await guruModel.findGuruByNIP(nip);
  if (!guru) throw new Error('NIP tidak ditemukan');
  const isValid = await bcrypt.compare(password, guru.password || guru.password_hash || guru.passwordHash);
  const user = { id: guru.user_id, role: 'guru', email: guru.email };
  if (!isValid) throw new Error('Kredensial tidak valid');
  return { token: createToken(user), user };
};

module.exports = { registerSiswa, registerGuru, loginSiswa, loginGuru };
