const Payment = require('../models/Payment');
const { Op } = require('sequelize');
import { NotFoundError, ForbiddenError } from '../utils/errors';

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

  static async getPayments(page: number = 1, limit: number = 20, userRole?: string, userId?: number) {
    const offset = (page - 1) * limit;

    const where: any = {};

    // Role-based filtering: patients can only see their own payments
    if (userRole === 'Patient') {
      where.patient_id = userId;
    }
    // Doctors should not see all payments - only their patients' if needed
    // For now, doctors get no payment access unless explicitly needed by workflow
    else if (userRole === 'Doctor') {
      // Doctors don't have a direct payment relationship - return empty
      return {
        payments: [],
        pagination: { total: 0, page, limit, totalPages: 0 }
      };
    }
    // Admin sees all payments (no filter)

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
      }
    };
  }

  static async updatePaymentStatus(id: number, status: string) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new NotFoundError('Payment record not found.');
    }
    payment.status = status;
    await payment.save();
    return payment;
  }

  static async initializeChapaPayment(amount: number, patientName: string, patientId: number | null, email: string) {
    const payment = await Payment.create({ 
      patient_id: patientId, 
      patient_name: patientName, 
      amount, 
      status: 'Pending' 
    });

    const txRef = `sheger-tx-${payment.id}-${Date.now()}`;
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY || 'dummy_chapa_key';
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    try {
      const axios = require('axios');
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
            description: 'Telemedicine Payment'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${chapaSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Save txRef if needed or just return the checkout url
      // For now, returning the checkout url
      return {
        paymentId: payment.id,
        checkoutUrl: response.data.data.checkout_url,
        txRef
      };
    } catch (error: any) {
      // Cleanup on failure
      await payment.destroy();
      throw new Error(error.response?.data?.message || 'Chapa initialization failed');
    }
  }

  static async verifyChapaPayment(txRef: string) {
    const chapaSecretKey = process.env.CHAPA_SECRET_KEY || 'dummy_chapa_key';
    
    try {
      const axios = require('axios');
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${txRef}`,
        {
          headers: {
            Authorization: `Bearer ${chapaSecretKey}`
          }
        }
      );

      const status = response.data.data.status;
      
      // Parse txRef (format: sheger-tx-{paymentId}-{timestamp})
      const paymentId = parseInt(txRef.split('-')[2]);
      
      if (status === 'success') {
        return await this.updatePaymentStatus(paymentId, 'Completed');
      } else {
        return await this.updatePaymentStatus(paymentId, 'Failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Chapa verification failed');
    }
  }
}
