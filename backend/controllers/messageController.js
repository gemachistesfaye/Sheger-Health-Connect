const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Send a message
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
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
    let whereClause = {};
    if (req.user.role === 'Patient') {
      whereClause.role = 'Doctor';
    } else if (req.user.role === 'Doctor') {
      whereClause.role = 'Patient';
    }

    const contacts = await User.findAll({
      where: whereClause,
      attributes: ['id', 'full_name', 'role', 'specialization']
    });

    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getMessagesWithUser, getContacts };
