const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const { aiChatValidation } = require('../middleware/validation');

router.post('/chat', protect, aiLimiter, aiChatValidation, chatWithAssistant);

module.exports = router;
