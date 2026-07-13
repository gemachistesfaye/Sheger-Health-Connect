const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { isAccountLocked, handleFailedLogin, resetLoginAttempts, blacklistToken } = require('../middleware/accountSecurity');
const { AUDIT_ACTIONS } = require('../middleware/audit');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { full_name, username, email, phone, password, role, specialization } = req.body;

    // Validate request
    if (!full_name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide required fields (full_name, username, password)' });
    }

    // Check if user exists (by username)
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    // Check if email is already taken
    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      full_name,
      username,
      email,
      phone,
      password_hash,
      role: role || 'Patient',
      specialization
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id, user.role),
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    // Check for user
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        success: false, 
        message: `Account is locked. Try again in ${remainingTime} minutes.` 
      });
    }

    if (user.banned) {
      return res.status(403).json({ success: false, message: 'Your account has been banned by the administrator.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      await handleFailedLogin(user);
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Reset login attempts on successful login
    await resetLoginAttempts(user);

    // Audit log
    if (req.auditLog) {
      req.auditLog(AUDIT_ACTIONS.USER_LOGIN, {
        targetId: user.id,
        targetType: 'User',
        metadata: { username: user.username, role: user.role }
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.update({ resetPasswordToken, resetPasswordExpire });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    const htmlMessage = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#0d6efd;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
        html: htmlMessage
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.error(err);
      await user.update({ resetPasswordToken: null, resetPasswordExpire: null });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        // Sequelize equivalent to $gt for dates can be tricky, but we can use Op.gt or just raw comparison if we set up Op
      }
    });

    if (!user || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid token or token expired' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(req.body.password, salt);

    await user.update({
      password_hash,
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      }
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
};
