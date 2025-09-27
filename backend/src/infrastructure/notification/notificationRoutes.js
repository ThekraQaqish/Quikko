const express = require("express");
const router = express.Router();
const controller = require("./notificationController");
const { protect, authorizeRole } = require("../../middleware/authMiddleware");
const {admin} = require("../firebase"); // لازم يكون موجود لاستعمال send-test
const pool = require("../../config/db");


/**
 * @route POST /api/notifications
 * @desc Send a notification to a single user or a group of users by role
 * @access Protected (requires JWT token)
 * @body {number} [userId] - Target user ID (optional if role is provided)
 * @body {string} [role] - Target role (optional if userId is provided)
 * @body {string} title - Notification title
 * @body {string} message - Notification body/message
 * @body {string} [type="general"] - Notification type/category
 * @returns {object} success status and additional info (e.g., count of users notified)
 */
router.post("/", protect, controller.sendNotification);

/**
 * @route GET /api/notifications
 * @desc Get all notifications for the currently logged-in user
 * @access Protected (requires JWT token)
 * @returns {Array} Array of notification objects
 */
router.get("/", protect, controller.getNotifications);


// routes/userRoutes.js
router.post("/save-fcm-token", protect, async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return res.status(400).json({ error: "FCM token required" });

  await pool.query("UPDATE users SET fcm_token = $1 WHERE id = $2", [fcmToken, req.user.id]);

  res.json({ success: true, fcmToken });
});



/**
 * @route POST /api/notifications/send-test
 * @desc Send a test notification to a specific FCM token (for development/testing)
 * @access Protected (requires JWT token)
 * @body {string} fcmToken - FCM token of the target device
 * @returns {object} success status and Firebase response or error
 * @throws {400} Validation error if fcmToken is missing
 * @throws {500} Server error if Firebase messaging fails
 */
router.post("/send-test", async (req, res) => {
  const { fcmToken } = req.body;

  if (!fcmToken) return res.status(400).json({ message: "FCM token required" });

  const message = {
    token: fcmToken,
    notification: {
      title: "Test Notification",
      body: "Hello! This is a test message from backend.",
      icon: "/favicon.ico"
    },
    webpush: { headers: { Urgency: "high" } },
  };

  try {
    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;


/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Notification management endpoints
 *
 * components:
 *   securitySchemes:
 *     adminAuth:               
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - adminAuth: []            
 *
 * paths:
 *   /api/notifications:
 *     post:
 *       summary: Send a notification
 *       tags: [Notifications]
 *       security:
 *         - adminAuth: []     
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   description: Target user ID (optional if role is provided)
 *                 role:
 *                   type: string
 *                   description: Target role (optional if userId is provided)
 *                 title:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                   description: Type of notification
 *                   default: general
 *       responses:
 *         200:
 *           description: Notification sent successfully
 *         400:
 *           description: Validation error
 *
 *     get:
 *       summary: Get notifications for logged-in user
 *       tags: [Notifications]
 *       security:
 *         - adminAuth: []        
 *       responses:
 *         200:
 *           description: Array of notifications
 *
 *   /api/notifications/send-test:
 *     post:
 *       summary: Send a test notification
 *       tags: [Notifications]
 *       security:
 *         - adminAuth: []       
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fcmToken:
 *                   type: string
 *       responses:
 *         200:
 *           description: Test notification sent
 *         400:
 *           description: Validation error
 */
