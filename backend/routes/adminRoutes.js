const express = require('express');
const router = express.Router();
const { getDoctors, onboardDoctor, getStats, toggleDoctorBan, deleteDoctor, transferAppointment } = require('../controllers/adminController');
const { addPayment, getPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getStats);
router.get('/doctors', getDoctors);
router.post('/doctors', onboardDoctor);
router.put('/doctors/:id/ban', toggleDoctorBan);
router.delete('/doctors/:id', deleteDoctor);
router.put('/appointments/:id/transfer', transferAppointment);

router.get('/payments', getPayments);
router.post('/payments', addPayment);

module.exports = router;
