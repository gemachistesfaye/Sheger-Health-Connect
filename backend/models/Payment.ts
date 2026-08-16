import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { PaymentStatus } from '../types';

export interface PaymentModel extends Model {
  id: number;
  patient_id: number | null;
  patient_name: string;
  amount: number;
  status: PaymentStatus;
  screenshot: string | null;
  created_at: Date;
  updated_at: Date;
}

const Payment = sequelize.define<PaymentModel>('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  patient_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending'),
    defaultValue: 'Pending',
  },
  screenshot: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'Payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['patient_id'] },
    { fields: ['patient_name'] },
    { fields: ['status'] }
  ]
});

export { Payment };
export default Payment;
