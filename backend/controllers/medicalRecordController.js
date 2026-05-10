const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Create a new medical record (Diagnosis & Prescription)
// @route   POST /api/records
// @access  Private (Doctor only)
const createRecord = async (req, res) => {
  try {
    const { patient_id, appointment_id, diagnosis, prescriptions, allergies, lab_results, notes } = req.body;
    const doctor_id = req.user.id;

    if (!patient_id || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Patient ID and Diagnosis are required.' });
    }

    const record = await MedicalRecord.create({
      patient_id,
      doctor_id,
      appointment_id,
      diagnosis,
      prescriptions,
      allergies,
      lab_results,
      notes
    });

    // Optionally update the appointment status to Completed if linked
    if (appointment_id) {
      await Appointment.update({ status: 'Completed' }, { where: { id: appointment_id } });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    console.error('Create Record Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving medical record' });
  }
};

// @desc    Get medical records for a patient
// @route   GET /api/records/:patientId
// @access  Private (Doctor, Patient themselves, Admin)
const getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Authorization check: Patients can only view their own records
    if (req.user.role === 'Patient' && req.user.id.toString() !== patientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these records.' });
    }

    const records = await MedicalRecord.findAll({ 
      where: { patient_id: patientId },
      order: [['visit_date', 'DESC']]
    });

    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Get Records Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving medical records' });
  }
};

module.exports = {
  createRecord,
  getPatientRecords
};
