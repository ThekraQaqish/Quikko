const notificationService = require("./notificationService");

// POST /notifications
exports.sendNotification = async (req, res) => {
  try {
    const { userId, role, title, message, type } = req.body;

    if ((!userId && !role) || !title || !message) {
      return res.status(400).json({
        error: "userId OR role is required, along with title and message",
      });
    }

    if (userId) {
      // إرسال لمستخدم واحد
      await notificationService.sendNotificationToUser(userId, { title, message, type });
    } else if (role) {
      // إرسال لكل مستخدمين role معيّن
      await notificationService.sendNotificationToRole(role, { title, message, type });
    }

    res.json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /notifications?userId=123
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
