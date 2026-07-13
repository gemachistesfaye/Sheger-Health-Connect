const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesWithUser, getContacts } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { sendMessageValidation } = require('../middleware/validation');

router.use(protect);

router.post('/', sendMessageValidation, sendMessage);
router.get('/history/:userId', getMessagesWithUser);
router.get('/contacts', getContacts);

module.exports = router;
