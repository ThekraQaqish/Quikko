// src/modules/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('./adminController');
const { protect, authorizeRole } = require('../../middleware/authMiddleware');

// Vendors
router.get('/vendors/pending', adminController.getPendingVendors);
router.put('/vendors/:vendorId/approve', adminController.approveVendor);
router.put('/vendors/:vendorId/reject', adminController.rejectVendor);

// Deliveries
router.get('/deliveries/pending', adminController.getPendingDeliveries);
router.put('/deliveries/:deliveryId/approve', adminController.approveDelivery);
router.put('/deliveries/:deliveryId/reject', adminController.rejectDelivery);
router.get('/orders', protect, authorizeRole('admin'), adminController.getAllOrders);


router.get("/delivery-companies", adminController.listAllCompanies);

module.exports = router;
