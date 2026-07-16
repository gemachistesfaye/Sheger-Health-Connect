import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { AppError } from '../utils/errors';
const { logger } = require('../utils/logger');

// @desc    Add payment record
const addPayment = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user ? req.user.id : null;
    const payment = await PaymentService.addPayment(req.body, patient_id);
    res.status(201).json({ success: true, data: payment });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Add Payment Error');
    res.status(500).json({ success: false, message: 'Server error adding payment' });
  }
};

// @desc    Get all payments (paginated)
const getPayments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await PaymentService.getPayments(page, limit);

    res.json({
      success: true,
      data: result.payments,
      pagination: result.pagination,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Get Payments Error');
    res.status(500).json({ success: false, message: 'Server error retrieving payments' });
  }
};

// @desc    Update payment status
const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const payment = await PaymentService.updatePaymentStatus(parseInt(req.params.id), status);
    res.json({ success: true, data: payment, message: `Payment marked as ${status} successfully!` });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    logger.error(error, 'Update Payment Status Error');
    res.status(500).json({ success: false, message: 'Server error updating payment status' });
  }
};

module.exports = { addPayment, getPayments, updatePaymentStatus };
