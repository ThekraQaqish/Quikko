const express = require('express');
const router = express.Router();
const chatController = require('./chatController');
const { protect } = require('../../middleware/authMiddleware'); // تحقق من التوكن

// GET /chat?user1=...&user2=...
router.get('/chat', protect, chatController.getChatMessages);

// POST /chat
router.post('/chat', protect, chatController.postChatMessage);

module.exports = router;
