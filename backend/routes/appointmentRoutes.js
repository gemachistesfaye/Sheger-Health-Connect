const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { bookAppointmentValidation, updateAppointmentStatusValidation } = require('../middleware/validation');

router.use(protect);

router.post('/', bookAppointmentValidation, bookAppointment);
router.get('/', getAppointments);
router.put('/:id/status', authorize('Admin', 'Doctor'), updateAppointmentStatusValidation, updateAppointmentStatus);

module.exports = router;
