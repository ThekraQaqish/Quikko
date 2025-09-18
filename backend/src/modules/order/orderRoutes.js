const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const { protect } = require('../../middleware/authMiddleware');

// GET /orders - Customer orders
router.get('/', protect, orderController.getOrders);

module.exports = router;
