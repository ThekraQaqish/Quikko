const express = require("express");
const router = express.Router();
const userController = require("../user/userController");

// تحديث توكين Firebase
router.put("/:id/fcm-token", userController.updateFcmToken);

module.exports = router;
