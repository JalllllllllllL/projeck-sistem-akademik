const db = require('../db');

const getRanking = async () => {
  const [rows] = await db.query(
    `SELECT r.*, s.nama, s.kelas,
      ROUND(((r.bobot_akademik * r.nilai_akademik) + (r.bobot_keteladanan * r.nilai_keteladanan)), 2) AS ranking_score
    FROM ranking r
    JOIN siswa s ON r.siswa_id = s.id
    ORDER BY ranking_score DESC`
  );
  return rows;
};

const getRankingBySiswaId = async (siswaId) => {
  const [rows] = await db.query('SELECT * FROM ranking WHERE siswa_id = ?', [siswaId]);
  return rows[0];
};

const updateBobot = async ({ bobotAkademik, bobotKeteladanan }) => {
  const [result] = await db.query(
    'UPDATE ranking SET bobot_akademik = ?, bobot_keteladanan = ? WHERE 1',
    [bobotAkademik, bobotKeteladanan]
  );
  return result;
};

const upsertRanking = async ({ siswaId, disiplin, sikap, kehadiran, nilaiAkademik, bobotAkademik, bobotKeteladanan }) => {
  const nilaiKeteladanan = parseFloat(((disiplin + sikap + kehadiran) / 3).toFixed(2));
  const [existing] = await db.query('SELECT id FROM ranking WHERE siswa_id = ?', [siswaId]);
  if (existing.length) {
    await db.query(
      `UPDATE ranking SET disiplin = ?, sikap = ?, kehadiran = ?, nilai_akademik = ?, nilai_keteladanan = ?, bobot_akademik = ?, bobot_keteladanan = ?, updated_at = NOW() WHERE siswa_id = ?`,
      [disiplin, sikap, kehadiran, nilaiAkademik, nilaiKeteladanan, bobotAkademik, bobotKeteladanan, siswaId]
    );
    return existing[0].id;
  }

  const [result] = await db.query(
    `INSERT INTO ranking (siswa_id, disiplin, sikap, kehadiran, nilai_akademik, nilai_keteladanan, bobot_akademik, bobot_keteladanan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [siswaId, disiplin, sikap, kehadiran, nilaiAkademik, nilaiKeteladanan, bobotAkademik, bobotKeteladanan]
  );
  return result.insertId;
};

module.exports = { getRanking, getRankingBySiswaId, updateBobot, upsertRanking };
