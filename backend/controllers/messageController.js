const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// Define dynamic associations
Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;

    // Check if group message (receiver_id is 0)
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

      // Emit via Socket.io if receiver is connected
      const io = req.app.get('io');
      if (io) {
        io.to('group_staff').emit('receiveMessage', populatedMessage);
      }

      return res.status(201).json({ success: true, data: populatedMessage });
    }

    const newMessage = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      message
    });

    // Emit via Socket.io if receiver is connected
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiver_id}`).emit('receiveMessage', newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get message history with a specific user
// @route   GET /api/messages/history/:userId
const getMessagesWithUser = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    // IF otherUserId is '0' or 0, this is the CLINICAL STAFF GROUP CHAT!
    if (Number(otherUserId) === 0) {
      if (req.user.role !== 'Doctor') {
        return res.status(403).json({ success: false, message: 'Access denied. Doctors only staff room.' });
      }
      
      const messages = await Message.findAll({
        where: { receiver_id: 0 },
        include: [{ model: User, as: 'Sender', attributes: ['id', 'full_name'] }],
        order: [['created_at', 'ASC']]
      });

      return res.json({ success: true, data: messages });
    }

    // Mark received messages from this user as read
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
      order: [['created_at', 'ASC']]
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get contacts (Doctors for patients, Patients for doctors)
// @route   GET /api/messages/contacts
const getContacts = async (req, res) => {
  try {
    if (req.user.role === 'Patient') {
      // Patients can browse and message all Doctors in the clinic
      const contacts = await User.findAll({
        where: { role: 'Doctor', banned: false },
        attributes: ['id', 'full_name', 'role', 'specialization']
      });
      return res.json({ success: true, data: contacts });
    } 
    
    if (req.user.role === 'Doctor') {
      const Message = require('../models/Message');
      const Appointment = require('../models/Appointment');

      // Get all patient IDs who exchanged messages with this doctor
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: req.user.id },
            { receiver_id: req.user.id }
          ]
        },
        attributes: ['sender_id', 'receiver_id']
      });

      // Get all patient IDs who booked appointments with this doctor
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

      // Fetch patient records for those IDs
      const contacts = await User.findAll({
        where: {
          id: { [Op.in]: Array.from(patientIds) },
          role: 'Patient'
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getMessagesWithUser, getContacts };
