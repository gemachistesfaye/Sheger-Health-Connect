const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, refresh, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, passwordResetLimiter, authLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../middleware/validation');

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', passwordResetLimiter, forgotPasswordValidation, forgotPassword);
router.put('/resetpassword/:resettoken', passwordResetLimiter, resetPasswordValidation, resetPassword);
router.get('/refresh', authLimiter, refresh);
router.post('/logout', logout);

module.exports = router;
