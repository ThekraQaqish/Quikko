const express = require('express');
const router = express.Router();
const vendorController = require('./vendorController');
const { protect } = require('../../middleware/authMiddleware');
const { updateOrderStatusValidator } = require('./vendorValidators');

// GET /stores
router.get('/stores', vendorController.getVendors);

router.get("/reports/:vendorId", vendorController.getVendorReport);

// Get all orders for vendor
router.get('/orders', protect, vendorController.getOrders);

// Update order status
router.put('/orders/:id', protect, updateOrderStatusValidator, vendorController.updateOrderStatus);

module.exports = router;