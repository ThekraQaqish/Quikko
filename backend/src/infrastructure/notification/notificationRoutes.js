const express = require("express");
const router = express.Router();
const controller = require("./notificationController");
const { protect, authorizeRole } = require("../../middleware/authMiddleware");


router.post("/notifications",protect, controller.sendNotification);
router.get("/notifications",protect, controller.getNotifications);



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
