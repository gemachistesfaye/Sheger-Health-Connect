const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Auth validators
const registerValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain only letters and spaces'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain only letters, numbers, and underscores'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d+\-\s]+$/).withMessage('Phone number must contain only digits, spaces, +, -'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)'),
  body('role')
    .optional()
    .isIn(['Patient', 'Doctor', 'Admin']).withMessage('Role must be Patient, Doctor, or Admin'),
  body('specialization')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Specialization must be less than 100 characters'),
  validate
];

const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  validate
];

const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)'),
  validate
];

// Appointment validators
const bookAppointmentValidation = [
  body('doctor_id')
    .notEmpty().withMessage('Doctor ID is required')
    .isInt({ min: 1 }).withMessage('Doctor ID must be a positive integer'),
  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isLength({ max: 100 }).withMessage('Department must be less than 100 characters'),
  body('appointment_date')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Please provide a valid date')
    .custom((value) => {
      const date = new Date(value);
      if (date < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  body('appointment_time')
    .notEmpty().withMessage('Appointment time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format (24-hour)'),
  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),
  validate
];

const updateAppointmentStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed']).withMessage('Invalid status'),
  validate
];

// Medical record validators
const createRecordValidation = [
  body('patient_id')
    .notEmpty().withMessage('Patient ID is required')
    .isInt({ min: 1 }).withMessage('Patient ID must be a positive integer'),
  body('diagnosis')
    .trim()
    .notEmpty().withMessage('Diagnosis is required')
    .isLength({ max: 5000 }).withMessage('Diagnosis must be less than 5000 characters'),
  body('prescriptions')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 }).withMessage('Prescriptions must be less than 5000 characters'),
  body('allergies')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 }).withMessage('Allergies must be less than 2000 characters'),
  body('lab_results')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 }).withMessage('Lab results must be less than 5000 characters'),
  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes must be less than 2000 characters'),
  validate
];

// Message validators
const sendMessageValidation = [
  body('receiver_id')
    .notEmpty().withMessage('Receiver ID is required')
    .isInt({ min: 0 }).withMessage('Receiver ID must be a non-negative integer'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
  validate
];

// Payment validators
const addPaymentValidation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  validate
];

const updatePaymentStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Paid', 'Pending']).withMessage('Status must be Paid or Pending'),
  validate
];

// Admin validators
const onboardDoctorValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain only letters, numbers, and underscores'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('specialization')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Specialization must be less than 100 characters'),
  validate
];

const toggleBanValidation = [
  body('banned')
    .notEmpty().withMessage('Banned status is required')
    .isBoolean().withMessage('Banned must be a boolean'),
  validate
];

const transferAppointmentValidation = [
  body('doctor_id')
    .notEmpty().withMessage('Doctor ID is required')
    .isInt({ min: 1 }).withMessage('Doctor ID must be a positive integer'),
  validate
];

// AI chat validators
const aiChatValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message must be less than 2000 characters'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  bookAppointmentValidation,
  updateAppointmentStatusValidation,
  createRecordValidation,
  sendMessageValidation,
  addPaymentValidation,
  updatePaymentStatusValidation,
  onboardDoctorValidation,
  toggleBanValidation,
  transferAppointmentValidation,
  aiChatValidation
};
