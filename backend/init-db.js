const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err);
      process.exit(1);
    }

    // Create tables
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('siswa','guru')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS siswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        nama TEXT NOT NULL,
        nis TEXT NOT NULL UNIQUE,
        kelas TEXT NOT NULL,
        jenis_kelamin TEXT NOT NULL CHECK(jenis_kelamin IN ('Laki-laki','Perempuan')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS guru (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        nama TEXT NOT NULL,
        nip TEXT NOT NULL UNIQUE,
        mata_pelajaran TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS mata_pelajaran (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jadwal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kelas TEXT NOT NULL,
        hari TEXT NOT NULL CHECK(hari IN ('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu')),
        jam TEXT NOT NULL,
        mata_pelajaran_id INTEGER,
        guru_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE SET NULL,
        FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS absensi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        siswa_id INTEGER NOT NULL,
        tanggal DATE NOT NULL,
        jam TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Hadir','Izin','Sakit','Alpha')),
        keterangan TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS nilai (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        siswa_id INTEGER NOT NULL,
        tugas DECIMAL(5,2) DEFAULT 0,
        uts DECIMAL(5,2) DEFAULT 0,
        uas DECIMAL(5,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ranking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        siswa_id INTEGER NOT NULL,
        disiplin DECIMAL(5,2) DEFAULT 0,
        sikap DECIMAL(5,2) DEFAULT 0,
        kehadiran DECIMAL(5,2) DEFAULT 0,
        nilai_akademik DECIMAL(5,2) DEFAULT 0,
        nilai_keteladanan DECIMAL(5,2) DEFAULT 0,
        bobot_akademik DECIMAL(5,2) DEFAULT 0.7,
        bobot_keteladanan DECIMAL(5,2) DEFAULT 0.3,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS berita (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        judul TEXT NOT NULL,
        gambar TEXT,
        isi TEXT NOT NULL,
        penulis TEXT NOT NULL,
        tanggal_publikasi DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Split schema by semicolon and execute each statement
    const statements = schema.split(';').filter(s => s.trim());
    let completed = 0;

    statements.forEach((statement) => {
      db.run(statement, (err) => {
        if (err) {
          console.error('Error executing statement:', err);
        }
        completed++;
        if (completed === statements.length) {
          console.log('Database dan tabel berhasil dibuat / diperbarui.');
          db.close();
        }
      });
    });
  });
});
