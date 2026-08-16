import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export interface MessageModel extends Model {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  status: 'unread' | 'read';
  created_at: Date;
}

const Message = sequelize.define<MessageModel>('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    defaultValue: 'unread',
  }
}, {
  tableName: 'Messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['sender_id'] },
    { fields: ['receiver_id'] },
    { fields: ['sender_id', 'receiver_id'] },
    { fields: ['status'] }
  ]
});

export { Message };
export default Message;
