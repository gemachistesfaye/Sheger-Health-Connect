const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

// SECURITY: Rate limit contact form submissions
router.post('/', contactLimiter, submitContact);

module.exports = router;
