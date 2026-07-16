const Payment = require('../models/Payment');
import { NotFoundError } from '../utils/errors';

export class PaymentService {
  static async addPayment(data: any, patientId: number | null) {
    const { patient_name, amount, status, screenshot } = data;
    const payment = await Payment.create({ 
      patient_id: patientId, 
      patient_name, 
      amount, 
      status, 
      screenshot 
    });
    return payment;
  }

  static async getPayments(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    return {
      payments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    };
  }

  static async updatePaymentStatus(id: number, status: string) {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment record not found.');
    }
    payment.status = status;
    await payment.save();
    return payment;
  }
}
