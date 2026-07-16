import { Request, Response } from 'express';
const Message = require('../models/Message');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');
const { AUDIT_ACTIONS } = require('../middleware/audit');
const { logger } = require('../utils/logger');
import { emitToSocket } from '../utils/eventEmitter';

Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiver_id, message } = req.body;

    if (Number(receiver_id) === 0) {
      if (req.user.role !== 'Doctor') {
        return res.status(403).json({ success: false, message: 'Access denied. Doctors only staff room.' });
      }

      const newMessage = await Message.create({
        sender_id: req.user.id,
        receiver_id: 0,
        message
      });

      const populatedMessage = await Message.findOne({
        where: { id: newMessage.id },
        include: [{ model: User, as: 'Sender', attributes: ['id', 'full_name'] }]
      });

      emitToSocket('group_staff', 'receiveMessage', populatedMessage);

      if (req.auditLog) {
        req.auditLog(AUDIT_ACTIONS.MESSAGE_SENT, {
          targetId: newMessage.id,
          targetType: 'Message',
          metadata: { receiver_id: 0, isGroup: true }
        });
      }

      return res.status(201).json({ success: true, data: populatedMessage });
    }

    const newMessage = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      message
    });

    emitToSocket(`user_${receiver_id}`, 'receiveMessage', newMessage);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.MESSAGE_SENT, {
        targetId: newMessage.id,
        targetType: 'Message',
        metadata: { receiver_id }
      });
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    logger.error(error, 'Send Message Error');
    res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

const getMessagesWithUser = async (req: Request, res: Response) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    if (Number(otherUserId) === 0) {
      if (req.user.role !== 'Doctor') {
        return res.status(403).json({ success: false, message: 'Access denied. Doctors only staff room.' });
      }

      const messages = await Message.findAll({
        where: { receiver_id: 0 },
        include: [{ model: User, as: 'Sender', attributes: ['id', 'full_name'] }],
        order: [['created_at', 'ASC']],
        limit,
        offset
      });

      return res.json({ success: true, data: messages });
    }

    await Message.update(
      { status: 'read' },
      {
        where: {
          sender_id: otherUserId,
          receiver_id: myId,
          status: 'unread'
        }
      }
    );

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: myId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: myId }
        ]
      },
      order: [['created_at', 'ASC']],
      limit,
      offset
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    logger.error(error, 'Get Messages Error');
    res.status(500).json({ success: false, message: 'Server error retrieving messages' });
  }
};

const getContacts = async (req: Request, res: Response) => {
  try {
    if (req.user.role === 'Patient') {
      const contacts = await User.findAll({
        where: { role: 'Doctor', banned: false },
        attributes: ['id', 'full_name', 'role', 'specialization']
      });
      return res.json({ success: true, data: contacts });
    }

    if (req.user.role === 'Doctor') {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: req.user.id },
            { receiver_id: req.user.id }
          ]
        },
        attributes: ['sender_id', 'receiver_id']
      });

      const appointments = await Appointment.findAll({
        where: { doctor_id: req.user.id },
        attributes: ['patient_id']
      });

      const patientIds = new Set();
      messages.forEach(m => {
        if (m.sender_id !== req.user.id) patientIds.add(m.sender_id);
        if (m.receiver_id !== req.user.id) patientIds.add(m.receiver_id);
      });
      appointments.forEach(a => {
        patientIds.add(a.patient_id);
      });

      if (patientIds.size === 0) {
        return res.json({ success: true, data: [] });
      }

      const contacts = await User.findAll({
        where: {
          id: { [Op.in]: Array.from(patientIds) },
          role: { [Op.in]: ['Patient', 'Admin'] }
        },
        attributes: ['id', 'full_name', 'role']
      });

      return res.json({ success: true, data: contacts });
    }

    if (req.user.role === 'Admin') {
      const contacts = await User.findAll({
        where: { role: { [Op.in]: ['Doctor', 'Patient'] } },
        attributes: ['id', 'full_name', 'role', 'specialization']
      });
      return res.json({ success: true, data: contacts });
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    logger.error(error, 'Get Contacts Error');
    res.status(500).json({ success: false, message: 'Server error retrieving contacts' });
  }
};

module.exports = { sendMessage, getMessagesWithUser, getContacts };
