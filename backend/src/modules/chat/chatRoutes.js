const express = require('express');
const router = express.Router();
const chatController = require('./chatController');
const { protect } = require('../../middleware/authMiddleware');

// GET /chat?user1=...&user2=...
router.get('/', protect, chatController.getChatMessages);

router.post('/', protect, chatController.postChatMessage);

module.exports = router;
/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Get chat messages between two users
 *     security:
 *       - vendorAuth: []  
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: user1
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the first user
 *       - in: query
 *         name: user2
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the second user
 *     responses:
 *       200:
 *         description: List of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   sender_id:
 *                     type: integer
 *                     example: 1
 *                   receiver_id:
 *                     type: integer
 *                     example: 2
 *                   message:
 *                     type: string
 *                     example: "Hello, how are you?"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-18T10:15:30Z"
 */
