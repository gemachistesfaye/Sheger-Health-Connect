const express = require('express');
const router = express.Router();
const { createRecord, getPatientRecords } = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Doctor'), createRecord);
router.get('/:patientId', getPatientRecords);

module.exports = router;
