const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All appointment routes require authentication
router.use(protect);

router.post('/', bookAppointment);
router.get('/', getAppointments);
router.put('/:id/status', authorize('Admin', 'Doctor', 'Receptionist'), updateAppointmentStatus);

module.exports = router;
