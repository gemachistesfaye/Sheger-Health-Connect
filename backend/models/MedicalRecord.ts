import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export interface MedicalRecordModel extends Model {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  diagnosis: string;
  prescriptions: string | null;
  allergies: string | null;
  lab_results: string | null;
  notes: string | null;
  visit_date: Date;
  updated_at: Date;
}

const MedicalRecord = sequelize.define<MedicalRecordModel>('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Appointments',
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

export { MedicalRecord };
export default MedicalRecord;
