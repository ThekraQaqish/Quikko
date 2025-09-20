const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");

router.post("/pay", paymentController.createPayment);
router.get("/success", paymentController.executePayment);
router.get("/cancel", paymentController.cancelPayment);

module.exports = router;


/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Payment endpoints
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
 *   /api/payment/pay:
 *     post:
 *       summary: Create a new payment
 *       tags: [Payments]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         description: Payment information
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   description: Amount to pay
 *       responses:
 *         200:
 *           description: Payment created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   forwardLink:
 *                     type: string
 *         500:
 *           description: Internal server error
 *
 *   /api/payment/success:
 *     get:
 *       summary: Execute a PayPal payment after approval
 *       tags: [Payments]
 *       parameters:
 *         - name: paymentId
 *           in: query
 *           required: true
 *           schema:
 *             type: string
 *         - name: PayerID
 *           in: query
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Payment executed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   payment:
 *                     type: object
 *         500:
 *           description: Internal server error
 *
 *   /api/payment/cancel:
 *     get:
 *       summary: Cancel a payment
 *       tags: [Payments]
 *       responses:
 *         200:
 *           description: Payment canceled successfully
 *           content:
 *             text/plain:
 *               schema:
 *                 type: string
 *                 example: Payment canceled
 */