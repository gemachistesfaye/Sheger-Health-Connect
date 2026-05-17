const Payment = require('../models/Payment');

// @desc    Add payment record
const addPayment = async (req, res) => {
  try {
    const { patient_name, amount, status, screenshot } = req.body;
    const payment = await Payment.create({ patient_name, amount, status, screenshot });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addPayment, getPayments, updatePaymentStatus };
