const express = require('express');
const router = express.Router();
const vendorController = require('./vendorController');
const { protect } = require('../../middleware/authMiddleware');
const { updateOrderStatusValidator } = require('./vendorValidators');

router.get('/stores', vendorController.getVendors);

router.get("/reports/:vendorId", vendorController.getVendorReport);
router.get('/orders', protect, vendorController.getOrders);
router.put('/orders/:id', protect, updateOrderStatusValidator, vendorController.updateOrderStatus);
router.get("/products", protect, vendorController.getProducts);
router.get("/profile", protect, vendorController.getProfile);
router.put("/profile", protect, vendorController.updateProfile);



module.exports = router;



/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Vendors
 *     description: Vendor management endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * paths:
 *   /api/vendor/stores:
 *     get:
 *       summary: List all vendors
 *       tags: [Vendors]
 *       responses:
 *         200:
 *           description: Array of vendors
 *
 *   /api/vendor/reports/{vendorId}:
 *     get:
 *       summary: Get vendor report
 *       tags: [Vendors]
 *       parameters:
 *         - name: vendorId
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: Vendor ID
 *       responses:
 *         200:
 *           description: Vendor report
 *
 *   /api/vendor/orders:
 *     get:
 *       summary: Get all orders for the vendor
 *       tags: [Vendors]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Array of orders
 *
 *   /api/vendor/orders/{id}:
 *     put:
 *       summary: Update order status
 *       tags: [Vendors]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, shipped, delivered, cancelled]
 *       responses:
 *         200:
 *           description: Updated order
 *         400:
 *           description: Validation error
 *
 *   /api/vendor/products:
 *     get:
 *       summary: Get all products for the vendor
 *       tags: [Vendors]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Array of products
 *
 *   /api/vendor/profile:
 *     get:
 *       summary: Get vendor profile
 *       tags: [Vendors]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Vendor profile
 *
 *     put:
 *       summary: Update vendor profile
 *       tags: [Vendors]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 store_name:
 *                   type: string
 *                 store_slug:
 *                   type: string
 *                 store_logo:
 *                   type: string
 *                 store_banner:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 contact_email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 social_links:
 *                   type: object
 *       responses:
 *         200:
 *           description: Updated vendor profile
 */