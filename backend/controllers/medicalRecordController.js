const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { Op } = require('sequelize');
const { AUDIT_ACTIONS } = require('../middleware/audit');

// @desc    Create a new medical record (Diagnosis & Prescription)
// @route   POST /api/records
// @access  Private (Doctor only)
const createRecord = async (req, res) => {
  try {
    const { patient_id, appointment_id, diagnosis, prescriptions, allergies, lab_results, notes } = req.body;
    const doctor_id = req.user.id;

    // Verify doctor has an appointment with this patient
    const hasRelationship = await Appointment.findOne({
      where: {
        doctor_id,
        patient_id,
        status: { [Op.in]: ['Pending', 'Confirmed'] }
      }
    });

    if (!hasRelationship) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only create records for patients with active appointments.' 
      });
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

    // Audit log
    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MEDICAL_RECORD_CREATED, {
        targetId: record.id,
        targetType: 'MedicalRecord',
        metadata: { patient_id, appointment_id }
      });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    console.error('Create Record Error:', error);
    res.status(500).json({ success: false, message: 'Server error saving medical record' });
  }
};

// @desc    Get medical records for a patient
// @route   GET /api/records/:patientId?page=1&limit=20
// @access  Private (Doctor, Patient themselves, Admin)
const getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    // Authorization check: Patients can only view their own records
    if (req.user.role === 'Patient' && req.user.id.toString() !== patientId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these records.' });
    }

    // Authorization check: Doctors can only view records of their patients
    if (req.user.role === 'Doctor') {
      const hasRelationship = await Appointment.findOne({
        where: {
          doctor_id: req.user.id,
          patient_id: patientId
        }
      });

      if (!hasRelationship) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to view these records. No appointment relationship found.' 
        });
      }
    }

    const { count, rows: records } = await MedicalRecord.findAndCountAll({ 
      where: { patient_id: patientId },
      order: [['visit_date', 'DESC']],
      limit,
      offset
    });

    res.json({ 
      success: true, 
      data: records,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get Records Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving medical records' });
  }
};

module.exports = {
  createRecord,
  getPatientRecords
};
