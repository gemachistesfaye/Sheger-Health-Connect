import { Request, Response } from 'express';
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');

const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { doctor_id, department, appointment_date, appointment_time, notes } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !department || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const doctor = await User.findOne({ where: { id: doctor_id, role: 'Doctor' } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const existingAppointment = await Appointment.findOne({ where: { doctor_id, appointment_date, appointment_time } });
    if (existingAppointment) return res.status(400).json({ success: false, message: 'This time slot is already booked.' });

    const appointment = await Appointment.create({ patient_id, doctor_id, department, appointment_date, appointment_time, notes });

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.APPOINTMENT_CREATED, { targetId: appointment.id, targetType: 'Appointment', metadata: { doctor_id, department, appointment_date } });
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    logger.error(error, 'Book Appointment Error');
    res.status(500).json({ success: false, message: 'Server error while booking appointment' });
  }
};

const getAppointments = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    let whereClause = {};
    let includeClause = [];

    if (req.user.role === 'Patient') {
      whereClause = { patient_id: req.user.id };
      includeClause = [{ model: User, as: 'Doctor', attributes: ['id', 'full_name', 'specialization'] }];
    } else if (req.user.role === 'Doctor') {
      whereClause = { doctor_id: req.user.id };
      includeClause = [{ model: User, as: 'Patient', attributes: ['id', 'full_name', 'phone', 'email'] }];
    } else {
      includeClause = [
        { model: User, as: 'Patient', attributes: ['id', 'full_name'] },
        { model: User, as: 'Doctor', attributes: ['id', 'full_name'] }
      ];
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause, include: includeClause,
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']], limit, offset
    });

    res.json({ success: true, data: appointments, pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) } });
  } catch (error) {
    logger.error(error, 'Get Appointments Error');
    res.status(500).json({ success: false, message: 'Server error retrieving appointments' });
  }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status update' });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, data: appointment });
  } catch (error) {
    logger.error(error, 'Update Appointment Status Error');
    res.status(500).json({ success: false, message: 'Server error updating appointment' });
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
