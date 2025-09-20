// src/modules/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('./adminController');
const { protect, authorizeRole } = require('../../middleware/authMiddleware');

// Vendors
router.get('/vendors', adminController.getVendors);
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


/**
 * ===============================
 * Swagger Documentation (Admin)
 * ===============================
 */

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - vendor_id: 1
 *                   user_id: 10
 *                   store_name: "Tech Store"
 *                   status: "approved"
 */

/**
 * @swagger
 * /api/admin/vendors/pending:
 *   get:
 *     summary: Get pending vendors
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of pending vendors
 *         content:
 *           application/json:
 *             example:
 *               - vendor_id: 2
 *                 user_id: 11
 *                 store_name: "Food Shop"
 *                 status: "pending"
 */

/**
 * @swagger
 * /api/admin/vendors/{vendorId}/approve:
 *   put:
 *     summary: Approve vendor
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vendor approved
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor approved successfully"
 *               data:
 *                 vendor_id: 2
 *                 status: "approved"
 *       404:
 *         description: Vendor not found
 */

/**
 * @swagger
 * /api/admin/vendors/{vendorId}/reject:
 *   put:
 *     summary: Reject vendor
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vendor rejected
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor rejected successfully"
 *               data:
 *                 vendor_id: 2
 *                 status: "rejected"
 */

/**
 * @swagger
 * /api/admin/deliveries/pending:
 *   get:
 *     summary: Get pending delivery companies
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of pending deliveries
 *         content:
 *           application/json:
 *             example:
 *               - id: 5
 *                 user_id: 20
 *                 company_name: "Fast Delivery"
 *                 status: "pending"
 */

/**
 * @swagger
 * /api/admin/deliveries/{deliveryId}/approve:
 *   put:
 *     summary: Approve delivery company
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delivery approved
 *         content:
 *           application/json:
 *             example:
 *               message: "Delivery company approved successfully"
 *               data:
 *                 id: 5
 *                 status: "approved"
 */

/**
 * @swagger
 * /api/admin/deliveries/{deliveryId}/reject:
 *   put:
 *     summary: Reject delivery company
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delivery rejected
 *         content:
 *           application/json:
 *             example:
 *               message: "Delivery company rejected successfully"
 *               data:
 *                 id: 5
 *                 status: "rejected"
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             example:
 *               - order_id: 1
 *                 status: "pending"
 *                 total_amount: 50.00
 *                 customer:
 *                   id: 10
 *                   name: "John Doe"
 *                 items:
 *                   - product_id: 100
 *                     name: "Laptop"
 *                     quantity: 1
 *                     price: 50.00
 */

/**
 * @swagger
 * /api/admin/delivery-companies:
 *   get:
 *     summary: Get all delivery companies
 *     tags: [Admin]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: List of delivery companies
 *         content:
 *           application/json:
 *             example:
 *               companies:
 *                 - company_id: 1
 *                   user_id: 30
 *                   company_name: "SpeedX"
 *                   status: "approved"
 */