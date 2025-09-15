const express = require('express');
const router = express.Router();
const customerController = require('./customerController');
const { protect } = require('../../middleware/authMiddleware');

// Customer routes
router.get('/', protect, customerController.getProfile);
router.put('/', protect, customerController.updateProfile);


module.exports = router;
