const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit a payment record with screenshot
router.post('/', async (req, res) => {
  try {
    const { amount, screenshot } = req.body;
    const payment = await Payment.create({
      patient_name: req.user.full_name,
      amount,
      status: 'Pending',
      screenshot
    });
    res.status(201).json({ success: true, data: payment, message: 'Payment slip submitted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
