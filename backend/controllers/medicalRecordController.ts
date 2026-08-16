import { Response, NextFunction } from 'express';
import { MedicalRecordService } from '../services/MedicalRecordService';
import { AUDIT_ACTIONS } from '../middleware/audit';
import { AuthenticatedRequest } from '../types';

export const createRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await MedicalRecordService.createRecord(req.body, req.user.id);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MEDICAL_RECORD_CREATED, {
        targetId: record.id,
        targetType: 'MedicalRecord',
        metadata: { patient_id: req.body.patient_id },
      });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const getPatientRecords = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await MedicalRecordService.getPatientRecords(
      parseInt(req.params.patientId as string),
      req.user.role,
      req.user.id,
      page,
      limit
    );

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MEDICAL_RECORD_ACCESSED, {
        targetId: parseInt(req.params.patientId as string),
        targetType: 'MedicalRecord',
        metadata: { count: result.records.length },
      });
    }

    res.json({ success: true, data: result.records, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};
