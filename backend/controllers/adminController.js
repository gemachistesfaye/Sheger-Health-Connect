const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'Doctor' },
      attributes: { exclude: ['password_hash'] }
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    console.error('Get Doctors Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching doctors' });
  }
};

// @desc    Create a new doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
const onboardDoctor = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password || 'Doctor@2026', salt);

    const doctor = await User.create({
      full_name,
      email,
      phone,
      password_hash,
      role: 'Doctor'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Doctor onboarded successfully',
      data: { id: doctor.id, full_name: doctor.full_name, email: doctor.email }
    });
  } catch (error) {
    console.error('Onboard Doctor Error:', error);
    res.status(500).json({ success: false, message: 'Server error onboarding doctor' });
  }
};

module.exports = {
  getDoctors,
  onboardDoctor
};
