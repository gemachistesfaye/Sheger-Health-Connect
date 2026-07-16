import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/MedicalRecordService';
const { AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');
import { AppError } from '../utils/errors';

const createRecord = async (req: Request, res: Response) => {
  try {
    const doctor_id = req.user.id;
    
    // Extract S3 URLs if files were uploaded
    const files = req.files as any[];
    let lab_results = req.body.lab_results || '';
    if (files && files.length > 0) {
      const urls = files.map((file) => file.location);
      // Append URLs to existing lab_results or overwrite
      lab_results = lab_results ? `${lab_results}, ${urls.join(', ')}` : urls.join(', ');
    }
    
    const payload = { ...req.body, lab_results };
    
    const record = await MedicalRecordService.createRecord(payload, doctor_id);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MEDICAL_RECORD_CREATED, { 
        targetId: record.id, 
        targetType: 'MedicalRecord', 
        metadata: { patient_id: req.body.patient_id, appointment_id: req.body.appointment_id } 
      });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Create Record Error');
    res.status(500).json({ success: false, message: 'Server error saving medical record' });
  }
};

const getPatientRecords = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await MedicalRecordService.getPatientRecords(
      parseInt(patientId),
      req.user.role,
      req.user.id,
      page,
      limit
    );

    res.json({ success: true, data: result.records, pagination: result.pagination });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Get Records Error');
    res.status(500).json({ success: false, message: 'Server error retrieving medical records' });
  }
};

module.exports = { createRecord, getPatientRecords };
