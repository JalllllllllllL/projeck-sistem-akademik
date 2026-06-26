const db = require('../db');
const bcrypt = require('bcrypt');

const createUser = async (email, passwordHash, role) => {
  const [result] = await db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    [email, passwordHash, role]
  );
  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('Pengguna tidak ditemukan');
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) throw new Error('Password lama salah');
  const newHash = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);
  return true;
};

module.exports = { createUser, findUserByEmail, findUserById, changePassword };
