// routes/orders.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/', protect, orderController.getOrders);

module.exports = router;

/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Customer orders endpoints
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
 *   /api/orders:
 *     get:
 *       summary: Get all orders for the logged-in customer
 *       tags: [Orders]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: List of customer orders returned
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     total_amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     payment_status:
 *                       type: string
 *                     shipping_address:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: integer
 *         404:
 *           description: No orders found
 *         500:
 *           description: Internal server error
 */
