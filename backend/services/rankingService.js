const rankingModel = require('../models/rankingModel');
const nilaiModel = require('../models/nilaiModel');
const siswaModel = require('../models/siswaModel');

const getRanking = async () => {
  return await rankingModel.getRanking();
};

const updateBobot = async (bobotAkademik, bobotKeteladanan) => {
  await rankingModel.updateBobot({ bobotAkademik, bobotKeteladanan });
};

const recalculateRanking = async () => {
  const allSiswa = await siswaModel.getAllSiswa();
  const allRanking = await rankingModel.getRanking();
  const bobotAkademik = allRanking[0]?.bobot_akademik || 0.7;
  const bobotKeteladanan = allRanking[0]?.bobot_keteladanan || 0.3;

  await Promise.all(
    allSiswa.map(async (siswa) => {
      const nilai = await nilaiModel.getNilaiBySiswaId(siswa.id);
      const akademik = nilai?.nilai_akhir ?? 0;
      const disiplin = 80;
      const sikap = 80;
      const kehadiran = 80;
      return rankingModel.upsertRanking({
        siswaId: siswa.id,
        disiplin,
        sikap,
        kehadiran,
        nilaiAkademik: akademik,
        bobotAkademik,
        bobotKeteladanan
      });
    })
  );
};

module.exports = { getRanking, updateBobot, recalculateRanking };
