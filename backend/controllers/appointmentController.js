const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { AUDIT_ACTIONS } = require('../middleware/audit');

// Define associations dynamically
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctor_id' });

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

    // Audit log
    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.APPOINTMENT_CREATED, {
        targetId: appointment.id,
        targetType: 'Appointment',
        metadata: { doctor_id, department, appointment_date }
      });
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Server error while booking appointment' });
  }
};

// @desc    Get user's appointments (Patient or Doctor perspective)
// @route   GET /api/appointments?page=1&limit=20
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    let whereClause = {};
    let includeClause = [];

    if (req.user.role === 'Patient') {
      whereClause = { patient_id: req.user.id };
      includeClause = [
        { model: User, as: 'Doctor', attributes: ['id', 'full_name', 'specialization'] }
      ];
    } else if (req.user.role === 'Doctor') {
      whereClause = { doctor_id: req.user.id };
      includeClause = [
        { model: User, as: 'Patient', attributes: ['id', 'full_name', 'phone', 'email'] }
      ];
    } else {
      // Admin sees all
      includeClause = [
        { model: User, as: 'Patient', attributes: ['id', 'full_name'] },
        { model: User, as: 'Doctor', attributes: ['id', 'full_name'] }
      ];
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']],
      limit,
      offset
    });

    res.json({ 
      success: true, 
      data: appointments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
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
