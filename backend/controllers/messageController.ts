import { Response, NextFunction } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';
import { AUDIT_ACTIONS } from '../middleware/audit';
import { logger } from '../utils/logger';
import { emitToSocket } from '../utils/eventEmitter';
import { AuthenticatedRequest } from '../types';

Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { receiver_id, message } = req.body;

    if (Number(receiver_id) === 0) {
      if (req.user.role !== 'Doctor') {
        res.status(403).json({ success: false, message: 'Access denied. Doctors only staff room.' });
        return;
      }

      const newMessage = await Message.create({
        sender_id: req.user.id,
        receiver_id: 0,
        message,
      });

      const populatedMessage = await Message.findOne({
        where: { id: newMessage.id },
        include: [{ model: User, as: 'Sender', attributes: ['id', 'full_name'] }],
      });

      emitToSocket('group_staff', 'receiveMessage', populatedMessage);

      if (req.auditLog) {
        req.auditLog(AUDIT_ACTIONS.MESSAGE_SENT, {
          targetId: newMessage.id,
          targetType: 'Message',
          metadata: { receiver_id: 0, isGroup: true },
        });
      }

      res.status(201).json({ success: true, data: populatedMessage });
      return;
    }

    const newMessage = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      message,
    });

    emitToSocket(`user_${receiver_id}`, 'receiveMessage', newMessage);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MESSAGE_SENT, {
        targetId: newMessage.id,
        targetType: 'Message',
        metadata: { receiver_id },
      });
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
};

const getMessagesWithUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const otherUserId = req.params.userId as string;
    const myId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    if (Number(otherUserId) === Number(myId)) {
      res.status(400).json({ success: false, message: 'Cannot retrieve messages with yourself' });
      return;
    }

    if (Number(otherUserId) === 0) {
      if (req.user.role !== 'Doctor') {
        res.status(403).json({ success: false, message: 'Access denied. Doctors only staff room.' });
        return;
      }

      const messages = await Message.findAll({
        where: { receiver_id: 0 },
        include: [{ model: User, as: 'Sender', attributes: ['id', 'full_name'] }],
        order: [['created_at', 'ASC']],
        limit,
        offset,
      });

      res.json({ success: true, data: messages });
      return;
    }

    const otherUser = await User.findByPk(otherUserId, { attributes: ['id', 'role'] });
    if (!otherUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (req.user.role === 'Patient' && otherUser.role !== 'Doctor') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    await Message.update(
      { status: 'read' },
      {
        where: {
          sender_id: otherUserId,
          receiver_id: myId,
          status: 'unread',
        },
      }
    );

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: myId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: myId },
        ],
      },
      order: [['created_at', 'ASC']],
      limit,
      offset,
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role === 'Patient') {
      const contacts = await User.findAll({
        where: { role: 'Doctor', banned: false },
        attributes: ['id', 'full_name', 'role', 'specialization'],
      });
      res.json({ success: true, data: contacts });
      return;
    }

    if (req.user.role === 'Doctor') {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }],
        },
        attributes: ['sender_id', 'receiver_id'],
      });

      const appointments = await Appointment.findAll({
        where: { doctor_id: req.user.id },
        attributes: ['patient_id'],
      });

      const patientIds = new Set<number>();
      messages.forEach((m) => {
        if (m.sender_id !== req.user.id) patientIds.add(m.sender_id);
        if (m.receiver_id !== req.user.id) patientIds.add(m.receiver_id);
      });
      appointments.forEach((a) => {
        patientIds.add(a.patient_id);
      });

      if (patientIds.size === 0) {
        res.json({ success: true, data: [] });
        return;
      }

      const contacts = await User.findAll({
        where: {
          id: { [Op.in]: Array.from(patientIds) },
          role: { [Op.in]: ['Patient', 'Admin'] },
        },
        attributes: ['id', 'full_name', 'role'],
      });

      res.json({ success: true, data: contacts });
      return;
    }

    if (req.user.role === 'Admin') {
      const contacts = await User.findAll({
        where: { role: { [Op.in]: ['Doctor', 'Patient'] } },
        attributes: ['id', 'full_name', 'role', 'specialization'],
      });
      res.json({ success: true, data: contacts });
      return;
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessagesWithUser, getContacts };
