import express from 'express';
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addPaymentValidation } = require('../middleware/validation');
const { addPayment, getPayments, updatePaymentStatus, initializeChapa, verifyChapaWebhook } = require('../controllers/paymentController');
import { uploadS3 } from '../utils/s3Upload';

// Chapa Webhook (Public endpoint, called by Chapa servers)
router.post('/chapa/webhook', verifyChapaWebhook);
router.get('/chapa/webhook', verifyChapaWebhook);

// Protected routes
router.use(protect);

// Get payments list
router.get('/', getPayments);

// Submit a payment record with screenshot (manual payment)
router.post('/', uploadS3.single('screenshot'), addPaymentValidation, addPayment);

// Update payment status (admin)
router.patch('/:id/status', updatePaymentStatus);

// Initialize Chapa payment
router.post('/chapa/initialize', initializeChapa);

module.exports = router;
