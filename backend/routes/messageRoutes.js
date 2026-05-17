const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesWithUser, getContacts } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/history/:userId', getMessagesWithUser);
router.get('/contacts', getContacts);

module.exports = router;
