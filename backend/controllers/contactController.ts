import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Security: Input length limits to prevent abuse
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: 'Name, email, and message are required' });
      return;
    }

    // Validate input lengths
    if (typeof name !== 'string' || name.length > MAX_NAME_LENGTH) {
      res.status(400).json({ success: false, message: `Name must be less than ${MAX_NAME_LENGTH} characters` });
      return;
    }
    if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH) {
      res.status(400).json({ success: false, message: `Email must be less than ${MAX_EMAIL_LENGTH} characters` });
      return;
    }
    if (subject && (typeof subject !== 'string' || subject.length > MAX_SUBJECT_LENGTH)) {
      res.status(400).json({ success: false, message: `Subject must be less than ${MAX_SUBJECT_LENGTH} characters` });
      return;
    }
    if (typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ success: false, message: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` });
      return;
    }

    logger.info({ name, email, subject }, 'Contact form submission received');

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.',
    });
  } catch (error) {
    logger.error(error, 'Contact form error');
    res.status(500).json({ success: false, message: 'Server error processing contact form' });
  }
};
