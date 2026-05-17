const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Doctor', 'Patient'),
    allowNull: false,
    defaultValue: 'Doctor',
  },
  specialization: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users',
  timestamps: true, // creates createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
