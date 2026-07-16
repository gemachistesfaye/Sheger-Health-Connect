const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');
import { ForbiddenError } from '../utils/errors';

export class MedicalRecordService {
  static async createRecord(data: any, doctorId: number) {
    const { patient_id, appointment_id, diagnosis, prescriptions, allergies, lab_results, notes } = data;

    // Check relationship
    const hasRelationship = await Appointment.findOne({
      where: { doctor_id: doctorId, patient_id, status: { [Op.in]: ['Pending', 'Confirmed'] } }
    });

    if (!hasRelationship) {
      throw new ForbiddenError('You can only create records for patients with active appointments.');
    }

    const record = await MedicalRecord.create({
      patient_id,
      doctor_id: doctorId,
      appointment_id,
      diagnosis,
      prescriptions,
      allergies,
      lab_results,
      notes
    });

    if (appointment_id) {
      await Appointment.update({ status: 'Completed' }, { where: { id: appointment_id } });
    }

    return record;
  }

  static async getPatientRecords(patientId: number, userRole: string, userId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    if (userRole === 'Patient' && userId.toString() !== patientId.toString()) {
      throw new ForbiddenError('Not authorized to view these records.');
    }

    if (userRole === 'Doctor') {
      const hasRelationship = await Appointment.findOne({ where: { doctor_id: userId, patient_id: patientId } });
      if (!hasRelationship) {
        throw new ForbiddenError('Not authorized to view these records.');
      }
    }

    const { count, rows: records } = await MedicalRecord.findAndCountAll({
      where: { patient_id: patientId },
      order: [['visit_date', 'DESC']],
      limit,
      offset
    });

    return {
      records,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}
