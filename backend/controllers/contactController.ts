import { Request, Response } from 'express';
const { logger } = require('../utils/logger');

const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    logger.info({ name, email, messageLength: message.length }, 'Contact form submission');

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will respond within 2 hours.',
      data: {
        id: Date.now(),
        name,
        email,
        message: message.substring(0, 500),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(error, 'Contact Form Error');
    res.status(500).json({ success: false, message: 'Server error submitting contact form' });
  }
};

module.exports = { submitContact };
