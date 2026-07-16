import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { AppError } from '../utils/errors';
const { AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');

const bookAppointment = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user.id;
    const appointment = await AppointmentService.bookAppointment(req.body, patient_id);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.APPOINTMENT_CREATED, { 
        targetId: appointment.id, 
        targetType: 'Appointment', 
        metadata: { 
          doctor_id: req.body.doctor_id, 
          department: req.body.department, 
          appointment_date: req.body.appointment_date 
        } 
      });
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Book Appointment Error');
    res.status(500).json({ success: false, message: 'Server error while booking appointment' });
  }
};

const getAppointments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AppointmentService.getAppointments(req.user.role, req.user.id, page, limit);

    res.json({ success: true, data: result.appointments, pagination: result.pagination });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Get Appointments Error');
    res.status(500).json({ success: false, message: 'Server error retrieving appointments' });
  }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await AppointmentService.updateAppointmentStatus(parseInt(req.params.id), status);

    res.json({ success: true, data: appointment });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Update Appointment Status Error');
    res.status(500).json({ success: false, message: 'Server error updating appointment' });
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
