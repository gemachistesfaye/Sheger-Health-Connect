import { Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';
import { AUDIT_ACTIONS } from '../middleware/audit';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types';

export const addPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await PaymentService.addPayment(req.body, req.user.id);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.PAYMENT_SUBMITTED, {
        targetId: payment.id,
        targetType: 'Payment',
        metadata: { amount: req.body.amount },
      });
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await PaymentService.getPayments(page, limit, req.user.role, req.user.id);
    res.json({ success: true, data: result.payments, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await PaymentService.updatePaymentStatus(parseInt(req.params.id as string), req.body.status);

    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.PAYMENT_STATUS_CHANGED, {
        targetId: payment.id,
        targetType: 'Payment',
        metadata: { status: req.body.status },
      });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const initializeChapa = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, email } = req.body;
    const user = req.user;
    const result = await PaymentService.initializeChapaPayment(amount, user.full_name, user.id, email);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const verifyChapaWebhook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tx_ref } = req.body;
    const result = await PaymentService.verifyChapaPayment(tx_ref);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
