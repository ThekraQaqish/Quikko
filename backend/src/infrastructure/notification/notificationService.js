const admin = require("../firebase");
const pool = require("../../config/db");

// إرسال إشعار + تخزينه
async function sendNotificationToUser(userId, { title, message, type }) {
  const userRes = await pool.query("SELECT fcm_token FROM users WHERE id = $1", [userId]);
  if (userRes.rows.length === 0) throw new Error("User not found");

  const token = userRes.rows[0].fcm_token;
  if (!token) throw new Error("User has no FCM token");

  await admin.messaging().send({
    token,
    notification: { title, body: message },
    data: { type: type || "general" },
  });

  await pool.query(
    `INSERT INTO notifications (user_id, title, message, type) 
     VALUES ($1, $2, $3, $4)`,
    [userId, title, message, type || null]
  );

  return { success: true };
}

// إرسال لمجموعة مستخدمين حسب role
async function sendNotificationToRole(role, { title, message, type }) {
  const usersRes = await pool.query("SELECT id, fcm_token FROM users WHERE role = $1", [role]);

  if (usersRes.rows.length === 0) throw new Error("No users found with that role");

  const tokens = usersRes.rows.filter(u => u.fcm_token).map(u => u.fcm_token);

  if (tokens.length === 0) throw new Error("No users have FCM tokens");

  // استخدام multicast للإرسال لأكثر من توكن
  await admin.messaging().sendMulticast({
    tokens,
    notification: { title, body: message },
    data: { type: type || "general" },
  });

  // تخزين الإشعارات
  for (const user of usersRes.rows) {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) 
       VALUES ($1, $2, $3, $4)`,
      [user.id, title, message, type || null]
    );
  }

  return { success: true, count: usersRes.rows.length };
}

// جلب الإشعارات
async function getUserNotifications(userId) {
  const res = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return res.rows;
}

module.exports = {
  sendNotificationToUser,
  sendNotificationToRole,
  getUserNotifications,
};
