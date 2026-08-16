import { Response, NextFunction } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { AUDIT_ACTIONS } from '../middleware/audit';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

export const bookAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await AppointmentService.bookAppointment(req.body, req.user.id);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.APPOINTMENT_CREATED, {
        targetId: appointment.id,
        targetType: 'Appointment',
        metadata: { doctor_id: req.body.doctor_id, date: req.body.appointment_date },
      });
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await AppointmentService.getAppointments(req.user.role, req.user.id, page, limit);
    res.json({ success: true, data: result.appointments, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await AppointmentService.updateAppointmentStatus(
      parseInt(req.params.id as string),
      req.body.status
    );

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.APPOINTMENT_STATUS_CHANGED, {
        targetId: appointment.id,
        targetType: 'Appointment',
        metadata: { status: req.body.status },
      });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
