import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { AppError } from '../utils/errors';
const { logger } = require('../utils/logger');

// @desc    Add payment record
const addPayment = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user ? req.user.id : null;
    
    // Extract S3 URL if a file was uploaded
    const file = req.file as any;
    const screenshot = file ? file.location : req.body.screenshot;
    
    const payload = { ...req.body, screenshot };
    
    const payment = await PaymentService.addPayment(payload, patient_id);
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

// @desc    Initialize Chapa Payment
const initializeChapa = async (req: Request, res: Response) => {
  try {
    const patient_id = req.user ? req.user.id : null;
    const email = req.user ? req.user.email : 'patient@shegerhealth.com';
    const patientName = req.user ? req.user.full_name : 'Guest Patient';
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const result = await PaymentService.initializeChapaPayment(parseFloat(amount), patientName, patient_id, email);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error(error, 'Initialize Chapa Error');
    res.status(500).json({ success: false, message: error.message || 'Server error initializing Chapa payment' });
  }
};

// @desc    Chapa Webhook
const verifyChapaWebhook = async (req: Request, res: Response) => {
  try {
    const txRef = req.body.tx_ref || req.query.tx_ref;
    if (!txRef) {
      return res.status(400).json({ success: false, message: 'tx_ref is required' });
    }

    await PaymentService.verifyChapaPayment(txRef as string);
    // Chapa expects a 200 OK response
    res.status(200).send('Webhook received');
  } catch (error: any) {
    logger.error(error, 'Verify Chapa Webhook Error');
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

module.exports = { addPayment, getPayments, updatePaymentStatus, initializeChapa, verifyChapaWebhook };
