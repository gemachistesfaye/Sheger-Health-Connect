import express from 'express';
const router = express.Router();
const { createRecord, getPatientRecords } = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createRecordValidation } = require('../middleware/validation');
import { uploadS3 } from '../utils/s3Upload';

router.use(protect);

router.post('/', authorize('Doctor'), uploadS3.array('attachments', 5), createRecordValidation, createRecord);
router.get('/:patientId', getPatientRecords);

module.exports = router;
