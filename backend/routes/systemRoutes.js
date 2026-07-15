const express = require('express');
const router = express.Router();
const { getSystemLogs, getSystemMetrics } = require('../controllers/systemController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/logs', getSystemLogs);
router.get('/metrics', getSystemMetrics);

module.exports = router;
