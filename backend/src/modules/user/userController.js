const pool = require("../../config/db");

exports.updateFcmToken = async (req, res) => {
  try {
    const { id } = req.params;      
    const { fcmToken } = req.body;   

    if (!fcmToken) {
      return res.status(400).json({ error: "fcmToken is required" });
    }

    await pool.query(
      "UPDATE users SET fcm_token = $1, updated_at = NOW() WHERE id = $2",
      [fcmToken, id]
    );

    res.json({ message: "FCM token updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
