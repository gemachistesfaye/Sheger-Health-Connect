import Appointment from '../models/Appointment';
import type { AppointmentModel } from '../models/Appointment';
import User from '../models/User';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { CreateAppointmentInput, AppointmentStatus, PaginationMeta } from '../types';

interface AppointmentListResult {
  appointments: AppointmentModel[];
  pagination: PaginationMeta;
}

export class AppointmentService {
  static async bookAppointment(data: CreateAppointmentInput, patientId: number): Promise<AppointmentModel> {
    const { doctor_id, department, appointment_date, appointment_time, notes } = data;

    if (!doctor_id || !department || !appointment_date || !appointment_time) {
      throw new BadRequestError('Please provide all required fields');
    }

    const doctor = await User.findOne({ where: { id: doctor_id, role: 'Doctor' } });
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    const existingAppointment = await Appointment.findOne({
      where: { doctor_id, appointment_date, appointment_time },
    });
    if (existingAppointment) {
      throw new BadRequestError('This time slot is already booked.');
    }

    const appointment = await Appointment.create({
      patient_id: patientId,
      doctor_id,
      department,
      appointment_date,
      appointment_time,
      notes: notes || null,
    });

    return appointment;
  }

  static async getAppointments(
    userRole: string,
    userId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<AppointmentListResult> {
    const offset = (page - 1) * limit;

    let whereClause: Record<string, unknown> = {};
    let includeClause: unknown[] = [];

    if (userRole === 'Patient') {
      whereClause = { patient_id: userId };
      includeClause = [{ model: User, as: 'Doctor', attributes: ['id', 'full_name', 'specialization'] }];
    } else if (userRole === 'Doctor') {
      whereClause = { doctor_id: userId };
      includeClause = [{ model: User, as: 'Patient', attributes: ['id', 'full_name', 'phone', 'email'] }];
    } else {
      includeClause = [
        { model: User, as: 'Patient', attributes: ['id', 'full_name'] },
        { model: User, as: 'Doctor', attributes: ['id', 'full_name'] },
      ];
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']],
      limit,
      offset,
    });

    return {
      appointments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async updateAppointmentStatus(id: number, status: string): Promise<AppointmentModel> {
    const validStatuses: AppointmentStatus[] = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status as AppointmentStatus)) {
      throw new BadRequestError('Invalid status update');
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = status as AppointmentStatus;
    await appointment.save();

    return appointment;
  }
}
