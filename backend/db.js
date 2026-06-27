const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'sistem_absensi_akademik',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Test koneksi saat startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
  });

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return [rows];
};

module.exports = { query, pool };