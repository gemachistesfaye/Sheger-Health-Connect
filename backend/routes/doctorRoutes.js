const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Get all doctors for public directory
// @route   GET /api/doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'Doctor', banned: false },
      attributes: ['id', 'full_name', 'specialization', 'email'] // limit fields for public
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
