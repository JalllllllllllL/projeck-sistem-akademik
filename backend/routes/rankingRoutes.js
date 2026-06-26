const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const rankingController = require('../controllers/rankingController');

router.use(authMiddleware, requireRole('guru'));
router.get('/', rankingController.getRanking);
router.put('/weights', rankingController.updateBobot);
router.post('/recalculate', rankingController.recalculateRanking);

module.exports = router;
