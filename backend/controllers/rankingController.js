const rankingService = require('../services/rankingService');

const getRanking = async (req, res, next) => {
  try {
    const data = await rankingService.getRanking();
    res.json(data);
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const updateBobot = async (req, res, next) => {
  try {
    const { bobotAkademik, bobotKeteladanan } = req.body;
    await rankingService.updateBobot(bobotAkademik, bobotKeteladanan);
    res.json({ message: 'Bobot ranking berhasil diubah' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

const recalculateRanking = async (req, res, next) => {
  try {
    await rankingService.recalculateRanking();
    res.json({ message: 'Ranking berhasil dihitung ulang' });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
};

module.exports = { getRanking, updateBobot, recalculateRanking };
