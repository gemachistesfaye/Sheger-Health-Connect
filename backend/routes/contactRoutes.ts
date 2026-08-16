import express from 'express';
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, submitContact);

module.exports = router;
