const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const beritaController = require('../controllers/beritaController');

router.get('/', beritaController.getAllBerita);
router.use(authMiddleware, requireRole('guru'));
router.post('/', beritaController.createBerita);
router.put('/:id', beritaController.updateBerita);
router.delete('/:id', beritaController.deleteBerita);

module.exports = router;
