import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { AppointmentStatus } from '../types';

export interface AppointmentModel extends Model {
  id: number;
  patient_id: number;
  doctor_id: number;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

const Appointment = sequelize.define<AppointmentModel>('Appointment', {
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
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    defaultValue: 'Pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'Appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['patient_id'] },
    { fields: ['doctor_id'] },
    { fields: ['appointment_date'] },
    { fields: ['status'] },
    { fields: ['doctor_id', 'appointment_date', 'appointment_time'], unique: true, name: 'unique_doctor_slot' }
  ]
});

export { Appointment };
export default Appointment;
