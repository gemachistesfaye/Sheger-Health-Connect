import { Request, Response } from 'express';
const { logger } = require('../utils/logger');

const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    // SECURITY: Validate and sanitize inputs
    const trimmedName = String(name).trim().substring(0, MAX_NAME_LENGTH);
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedMessage = String(message).trim().substring(0, MAX_MESSAGE_LENGTH);

    if (trimmedName.length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (trimmedMessage.length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
    }

    logger.info({ name: trimmedName, email: trimmedEmail, messageLength: trimmedMessage.length }, 'Contact form submission');

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will respond within 2 hours.',
      data: {
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(error, 'Contact Form Error');
    res.status(500).json({ success: false, message: 'Server error submitting contact form' });
  }
};

module.exports = { submitContact };
