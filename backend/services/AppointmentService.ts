const Appointment = require('../models/Appointment');
const User = require('../models/User');
import { BadRequestError, NotFoundError } from '../utils/errors';

export class AppointmentService {
  static async bookAppointment(data: any, patientId: number) {
    const { doctor_id, department, appointment_date, appointment_time, notes } = data;

    if (!doctor_id || !department || !appointment_date || !appointment_time) {
      throw new BadRequestError('Please provide all required fields');
    }

    const doctor = await User.findOne({ where: { id: doctor_id, role: 'Doctor' } });
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    const existingAppointment = await Appointment.findOne({ where: { doctor_id, appointment_date, appointment_time } });
    if (existingAppointment) {
      throw new BadRequestError('This time slot is already booked.');
    }

    const appointment = await Appointment.create({ 
      patient_id: patientId, 
      doctor_id, 
      department, 
      appointment_date, 
      appointment_time, 
      notes 
    });

    return appointment;
  }

  static async getAppointments(userRole: string, userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    let whereClause = {};
    let includeClause: any[] = [];

    if (userRole === 'Patient') {
      whereClause = { patient_id: userId };
      includeClause = [{ model: User, as: 'Doctor', attributes: ['id', 'full_name', 'specialization'] }];
    } else if (userRole === 'Doctor') {
      whereClause = { doctor_id: userId };
      includeClause = [{ model: User, as: 'Patient', attributes: ['id', 'full_name', 'phone', 'email'] }];
    } else {
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

    return {
      appointments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  static async updateAppointmentStatus(id: number, status: string) {
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError('Invalid status update');
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    appointment.status = status;
    await appointment.save();

    return appointment;
  }
}
