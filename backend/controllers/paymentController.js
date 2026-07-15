const Payment = require('../models/Payment');
const { logger } = require('../utils/logger');

// @desc    Add payment record
const addPayment = async (req, res) => {
  try {
    const { patient_name, amount, status, screenshot } = req.body;
    const patient_id = req.user ? req.user.id : null;
    const payment = await Payment.create({ patient_id, patient_name, amount, status, screenshot });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    logger.error(error, 'Add Payment Error');
    res.status(500).json({ success: false, message: 'Server error adding payment' });
  }
};

// @desc    Get all payments (paginated)
const getPayments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const { count, rows: payments } = await Payment.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: payments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(error, 'Get Payments Error');
    res.status(500).json({ success: false, message: 'Server error retrieving payments' });
  }
};

// @desc    Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }
    payment.status = status;
    await payment.save();
    res.json({ success: true, data: payment, message: `Payment marked as ${status} successfully!` });
  } catch (error) {
    logger.error(error, 'Update Payment Status Error');
    res.status(500).json({ success: false, message: 'Server error updating payment status' });
  }
};

module.exports = { addPayment, getPayments, updatePaymentStatus };
