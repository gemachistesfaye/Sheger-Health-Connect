const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
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

module.exports = Payment;
