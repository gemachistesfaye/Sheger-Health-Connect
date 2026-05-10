const express = require('express');
const router = express.Router();
const { getDoctors, onboardDoctor } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/doctors', getDoctors);
router.post('/doctors', onboardDoctor);

module.exports = router;
