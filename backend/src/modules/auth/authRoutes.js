const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { validateRegister, validateLogin } = require('./authValidators');

router.post('/register/customer', validateRegister, authController.registerUser);

router.post('/register/vendor', validateRegister, authController.registerVendor);

router.post('/register/delivery', validateRegister, authController.registerDelivery);

router.post('/login', validateLogin, authController.login);

module.exports = router;
/**
 * ===============================
 * Swagger Documentation (Auth)
 * ===============================
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and registration endpoints
 */

/**
 * @swagger
 * /api/auth/register/customer:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             password: "123456"
 *             phone: "+962788888888"
 *             address: "Amman, Jordan"
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Customer registered successfully"
 *               data:
 *                 postgresUser:
 *                   id: 1
 *                   name: "John Doe"
 *                   role: "customer"
 *               token: "JWT Token for customer"
 */

/**
 * @swagger
 * /api/auth/register/vendor:
 *   post:
 *     summary: Register a new vendor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Ali Shop"
 *             email: "ali@shop.com"
 *             password: "123456"
 *             phone: "+962799999999"
 *             store_name: "Ali Market"
 *             description: "Local shop for electronics"
 *     responses:
 *       201:
 *         description: Vendor registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor registered successfully"
 *               data:
 *                 postgresUser:
 *                   id: 2
 *                   name: "Ali Shop"
 *                   role: "vendor"
 *               token: "JWT Token for vendor"
 */

/**
 * @swagger
 * /api/auth/register/delivery:
 *   post:
 *     summary: Register a new delivery company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Speed Delivery"
 *             email: "speed@delivery.com"
 *             password: "123456"
 *             phone: "+962777777777"
 *             company_name: "Speed Delivery Co."
 *     responses:
 *       201:
 *         description: Delivery registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Delivery registered successfully"
 *               data:
 *                 postgresUser:
 *                   id: 3
 *                   name: "Speed Delivery"
 *                   role: "delivery"
 *               token: "JWT Token for delivery"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "john@example.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "JWT Token (customer/vendor/delivery depending on role)"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid credentials"
 *       403:
 *         description: Not approved (for vendor/delivery)
 *         content:
 *           application/json:
 *             example:
 *               error: "Your account is not approved yet by admin."
 */
