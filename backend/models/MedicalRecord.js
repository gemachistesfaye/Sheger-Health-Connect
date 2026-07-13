const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Appointment = require('./Appointment');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Appointment,
      key: 'id'
    },
    onDelete: 'SET NULL'
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
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['patient_id'] },
    { fields: ['doctor_id'] },
    { fields: ['appointment_id'] }
  ]
});

module.exports = MedicalRecord;
