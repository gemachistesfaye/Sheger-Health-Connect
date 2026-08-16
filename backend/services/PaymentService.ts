import Payment from '../models/Payment';
import type { PaymentModel } from '../models/Payment';
import { Op } from 'sequelize';
import axios from 'axios';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';
import { CreatePaymentInput, PaginationMeta, PaymentStatus } from '../types';

interface PaymentListResult {
  payments: PaymentModel[];
  pagination: PaginationMeta;
}

interface ChapaPaymentResult {
  paymentId: number;
  checkoutUrl: string;
  txRef: string;
}

export class PaymentService {
  static async addPayment(data: CreatePaymentInput, patientId: number | null): Promise<PaymentModel> {
    const { patient_name, amount, status, screenshot } = data;
    const payment = await Payment.create({
      patient_id: patientId,
      patient_name,
      amount,
      status: (status as PaymentStatus) || 'Pending',
      screenshot: screenshot || null,
    });
    return payment;
  }

  static async getPayments(
    page: number = 1,
    limit: number = 20,
    userRole?: string,
    userId?: number
  ): Promise<PaymentListResult> {
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (userRole === 'Patient') {
      where.patient_id = userId;
    } else if (userRole === 'Doctor') {
      return {
        payments: [],
        pagination: { total: 0, page, limit, totalPages: 0 },
      };
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
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
      },
    };
  }

  static async updatePaymentStatus(id: number, status: string): Promise<PaymentModel> {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new NotFoundError('Payment record not found.');
    }
    payment.status = status as PaymentStatus;
    await payment.save();
    return payment;
  }

  static async initializeChapaPayment(
    amount: number,
    patientName: string,
    patientId: number | null,
    email: string
  ): Promise<ChapaPaymentResult> {
    const payment = await Payment.create({
      patient_id: patientId,
      patient_name: patientName,
      amount,
      status: 'Pending',
    });

    const txRef = `sheger-tx-${payment.id}-${Date.now()}`;
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY || 'dummy_chapa_key';
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    try {
      const response = await axios.post(
        'https://api.chapa.co/v1/transaction/initialize',
        {
          amount: amount.toString(),
          currency: 'ETB',
          email: email || 'patient@shegerhealth.com',
          first_name: patientName.split(' ')[0] || 'Patient',
          last_name: patientName.split(' ')[1] || 'Name',
          tx_ref: txRef,
          callback_url: `${process.env.API_URL || 'http://localhost:5000'}/api/v1/payments/chapa/webhook`,
          return_url: `${baseUrl}/patient/payments`,
          customization: {
            title: 'Sheger Health Connect',
            description: 'Telemedicine Payment',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${chapaSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        paymentId: payment.id,
        checkoutUrl: response.data.data.checkout_url,
        txRef,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      await payment.destroy();
      throw new Error(err.response?.data?.message || 'Chapa initialization failed');
    }
  }

  static async verifyChapaPayment(txRef: string): Promise<PaymentModel> {
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY || 'dummy_chapa_key';

    try {
      const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        headers: { Authorization: `Bearer ${chapaSecretKey}` },
      });

      const status = response.data.data.status;
      const paymentId = parseInt(txRef.split('-')[2]);

      if (status === 'success') {
        return await this.updatePaymentStatus(paymentId, 'Completed');
      } else {
        return await this.updatePaymentStatus(paymentId, 'Failed');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(err.response?.data?.message || 'Chapa verification failed');
    }
  }
}
