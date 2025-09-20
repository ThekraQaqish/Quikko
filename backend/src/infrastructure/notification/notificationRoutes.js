const express = require("express");
const router = express.Router();
const controller = require("./notificationController");
const { protect, authorizeRole } = require("../../middleware/authMiddleware");


router.post("/",protect, controller.sendNotification);
router.get("/",protect, controller.getNotifications);



//for testing but important for now
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
