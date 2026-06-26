const db = require('../db');

const getJadwalSiswa = async (kelas) => {
  const [rows] = await db.query(
    `SELECT j.*, mp.nama AS mata_pelajaran, g.nama AS guru
    FROM jadwal j
    LEFT JOIN mata_pelajaran mp ON j.mata_pelajaran_id = mp.id
    LEFT JOIN guru g ON j.guru_id = g.id
    WHERE j.kelas = ? 
    ORDER BY 
      CASE j.hari 
        WHEN 'Senin' THEN 1
        WHEN 'Selasa' THEN 2
        WHEN 'Rabu' THEN 3
        WHEN 'Kamis' THEN 4
        WHEN 'Jumat' THEN 5
        WHEN 'Sabtu' THEN 6
        WHEN 'Minggu' THEN 7
      END, j.jam`,
    [kelas]
  );
  return rows;
};

const getJadwalGuru = async (guruId) => {
  const [rows] = await db.query(
    `SELECT j.*, mp.nama AS mata_pelajaran
    FROM jadwal j
    LEFT JOIN mata_pelajaran mp ON j.mata_pelajaran_id = mp.id
    WHERE j.guru_id = ? 
    ORDER BY 
      CASE j.hari 
        WHEN 'Senin' THEN 1
        WHEN 'Selasa' THEN 2
        WHEN 'Rabu' THEN 3
        WHEN 'Kamis' THEN 4
        WHEN 'Jumat' THEN 5
        WHEN 'Sabtu' THEN 6
        WHEN 'Minggu' THEN 7
      END, j.jam`,
    [guruId]
  );
  return rows;
};

module.exports = { getJadwalSiswa, getJadwalGuru };
