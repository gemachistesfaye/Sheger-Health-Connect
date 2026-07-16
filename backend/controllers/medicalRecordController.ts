import { Request, Response } from 'express';
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');
const { AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');

const createRecord = async (req: Request, res: Response) => {
  try {
    const { patient_id, appointment_id, diagnosis, prescriptions, allergies, lab_results, notes } = req.body;
    const doctor_id = req.user.id;

    const hasRelationship = await Appointment.findOne({
      where: { doctor_id, patient_id, status: { [Op.in]: ['Pending', 'Confirmed'] } }
    });

    if (!hasRelationship) {
      return res.status(403).json({ success: false, message: 'You can only create records for patients with active appointments.' });
    }

    const record = await MedicalRecord.create({ patient_id, doctor_id, appointment_id, diagnosis, prescriptions, allergies, lab_results, notes });

    if (appointment_id) {
      await Appointment.update({ status: 'Completed' }, { where: { id: appointment_id } });
    }

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MEDICAL_RECORD_CREATED, { targetId: record.id, targetType: 'MedicalRecord', metadata: { patient_id, appointment_id } });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    logger.error(error, 'Create Record Error');
    res.status(500).json({ success: false, message: 'Server error saving medical record' });
  }
};

const getPatientRecords = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    if (req.user.role === 'Patient' && req.user.id.toString() !== patientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these records.' });
    }

    if (req.user.role === 'Doctor') {
      const hasRelationship = await Appointment.findOne({ where: { doctor_id: req.user.id, patient_id: patientId } });
      if (!hasRelationship) {
        return res.status(403).json({ success: false, message: 'Not authorized to view these records.' });
      }
    }

    const { count, rows: records } = await MedicalRecord.findAndCountAll({
      where: { patient_id: patientId },
      order: [['visit_date', 'DESC']], limit, offset
    });

    res.json({ success: true, data: records, pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) } });
  } catch (error) {
    logger.error(error, 'Get Records Error');
    res.status(500).json({ success: false, message: 'Server error retrieving medical records' });
  }
};

module.exports = { createRecord, getPatientRecords };
