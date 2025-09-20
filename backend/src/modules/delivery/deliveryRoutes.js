// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");


router.put("/orders/:id", DeliveryController.updateStatus);
router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);
router.get("/coverage/:companyId", DeliveryController.getCoverageById);
router.get("/profile/:id", DeliveryController.getCompanyProfile);
router.put("/profile/:id", DeliveryController.updateCompanyProfile);
router.get("/orders/:companyId", DeliveryController.listCompanyOrders);
router.post("/coverage/:companyId", DeliveryController.addOrUpdateCoverage);

module.exports = router;
/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Delivery
 *     description: Delivery company related endpoints
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
 *   /api/delivery/orders/{id}:
 *     put:
 *       summary: Update order status
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Order ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, company_id]
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, out_for_delivery, delivered, cancelled]
 *                 company_id:
 *                   type: integer
 *       responses:
 *         200:
 *           description: Order status updated
 *         400:
 *           description: Invalid input
 *         403:
 *           description: Not authorized
 *         404:
 *           description: Order not found
 *
 *   /api/delivery/orders/{companyId}:
 *     get:
 *       summary: Get all orders for a delivery company
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: companyId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Company ID
 *       responses:
 *         200:
 *           description: List of orders
 *         400:
 *           description: Invalid company ID
 *
 *   /api/delivery/tracking/{orderId}:
 *     get:
 *       summary: Get tracking info for an order
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: orderId
 *           required: true
 *           schema:
 *             type: integer
 *           description: Order ID
 *       responses:
 *         200:
 *           description: Tracking info returned
 *         404:
 *           description: Order not found
 *
 *   /api/delivery/coverage/{companyId}:
 *     get:
 *       summary: Get coverage areas for a delivery company
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: companyId
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Company coverage returned
 *         404:
 *           description: Company not found
 *     post:
 *       summary: Add or update coverage areas for a company
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: companyId
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [areas]
 *               properties:
 *                 areas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of areas
 *       responses:
 *         200:
 *           description: Coverage areas updated
 *         400:
 *           description: Invalid input
 *
 *   /api/delivery/profile/{id}:
 *     get:
 *       summary: Get company profile
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Company profile returned
 *         404:
 *           description: Company not found
 *     put:
 *       summary: Update company profile
 *       tags: [Delivery]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company_name:
 *                   type: string
 *                 coverage_areas:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         200:
 *           description: Company profile updated
 *         400:
 *           description: Invalid input
 *         404:
 *           description: Company not found
 */
