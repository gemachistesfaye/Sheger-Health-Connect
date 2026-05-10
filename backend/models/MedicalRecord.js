const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prescriptions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lab_results: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'MedicalRecords',
  timestamps: true,
  createdAt: 'visit_date',
  updatedAt: 'updated_at'
});

module.exports = MedicalRecord;
