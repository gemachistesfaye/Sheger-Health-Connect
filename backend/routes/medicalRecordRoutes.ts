import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import { createRecordValidation } from '../middleware/validation';
import { uploadS3 } from '../utils/s3Upload';
const { createRecord, getPatientRecords } = require('../controllers/medicalRecordController');

const router = express.Router();

router.use(protect);

router.post('/', authorize('Doctor'), uploadS3.array('attachments', 5), createRecordValidation, createRecord);
router.get('/:patientId', authorize('Patient', 'Doctor', 'Admin'), getPatientRecords);

module.exports = router;
