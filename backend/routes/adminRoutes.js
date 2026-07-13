const express = require('express');
const router = express.Router();
const { getDoctors, onboardDoctor, getStats, toggleDoctorBan, deleteDoctor, transferAppointment } = require('../controllers/adminController');
const { addPayment, getPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { onboardDoctorValidation, toggleBanValidation, transferAppointmentValidation, updatePaymentStatusValidation } = require('../middleware/validation');

// All admin routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getStats);
router.get('/doctors', getDoctors);
router.post('/doctors', onboardDoctorValidation, onboardDoctor);
router.put('/doctors/:id/ban', toggleBanValidation, toggleDoctorBan);
router.delete('/doctors/:id', deleteDoctor);
router.put('/appointments/:id/transfer', transferAppointmentValidation, transferAppointment);

router.get('/payments', getPayments);
router.post('/payments', addPayment);
router.put('/payments/:id', updatePaymentStatusValidation, updatePaymentStatus);

module.exports = router;
