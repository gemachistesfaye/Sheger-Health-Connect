const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addPaymentValidation } = require('../middleware/validation');
const { AUDIT_ACTIONS } = require('../middleware/audit');
const Payment = require('../models/Payment');

router.use(protect);

// Get payments list
router.get('/', async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'Patient') {
      whereClause = { patient_name: req.user.full_name };
    }
    const payments = await Payment.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching payments' });
  }
});

// Submit a payment record with screenshot
router.post('/', addPaymentValidation, async (req, res) => {
  try {
    const { amount, screenshot } = req.body;
    const payment = await Payment.create({
      patient_name: req.user.full_name,
      amount,
      status: 'Pending',
      screenshot: screenshot || null
    });

    // Audit log
    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.PAYMENT_SUBMITTED, {
        targetId: payment.id,
        targetType: 'Payment',
        metadata: { amount }
      });
    }

    res.status(201).json({ success: true, data: payment, message: 'Payment slip submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error submitting payment' });
  }
});

module.exports = router;
