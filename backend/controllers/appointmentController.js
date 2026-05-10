const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient/Admin)
const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, department, appointment_date, appointment_time, notes } = req.body;
    const patient_id = req.user.id;

    // Basic validation
    if (!doctor_id || !department || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if the doctor exists and is actually a doctor
    const doctor = await User.findOne({ where: { id: doctor_id, role: 'Doctor' } });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check for double booking (same doctor, same date, same time)
    const existingAppointment = await Appointment.findOne({
      where: { doctor_id, appointment_date, appointment_time }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked.' });
    }

    const appointment = await Appointment.create({
      patient_id,
      doctor_id,
      department,
      appointment_date,
      appointment_time,
      notes
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Server error while booking appointment' });
  }
};

// @desc    Get user's appointments (Patient or Doctor perspective)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'Patient') {
      appointments = await Appointment.findAll({ where: { patient_id: req.user.id } });
    } else if (req.user.role === 'Doctor') {
      appointments = await Appointment.findAll({ where: { doctor_id: req.user.id } });
    } else {
      // Admin/Receptionist sees all
      appointments = await Appointment.findAll();
    }

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Get Appointments Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving appointments' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor/Receptionist/Admin)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Optional: add permission checks here (e.g., patient can only cancel, doctor can complete)

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Update Appointment Status Error:', error);
    res.status(500).json({ success: false, message: 'Server error updating appointment' });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus
};
