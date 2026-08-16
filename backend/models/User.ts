import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole } from '../types';

export interface UserModel extends Model {
  id: number;
  full_name: string;
  username: string;
  email: string | null;
  phone: string | null;
  password_hash: string;
  role: UserRole;
  specialization: string | null;
  department: string | null;
  isVerified: boolean;
  banned: boolean;
  refreshToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  verificationToken: string | null;
  verificationExpire: Date | null;
  lockUntil: Date | null;
  loginAttempts: number;
  created_at: Date;
  updated_at: Date;
}

const User = sequelize.define<UserModel>('User', {
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
  banned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  loginAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  verificationExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['role'] },
    { fields: ['banned'] },
    { fields: ['resetPasswordToken'] },
    { fields: ['verificationToken'] },
    { fields: ['isVerified'] }
  ]
});

export { User };
export default User;
