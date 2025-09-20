const express = require("express");
const customerController = require("./customerController");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();
const { getAllProductsValidator } = require("./customerValidators");


router.get('/', protect, customerController.getProfile);
router.put('/', protect, customerController.updateProfile);
router.get("/stores/:storeId", customerController.fetchStoreDetails);
router.post("/checkout", protect, customerController.postOrder);
router.get("/orders/:orderId", protect, customerController.getOrderDetails);
router.get("/orders/:orderId/track", protect, customerController.trackOrder);

// Carts
router.get("/cart", protect, customerController.getAllCarts); 
router.get("/cart/:id", protect, customerController.getCartById);
router.post("/cart", protect, customerController.createCart); 
router.put("/cart/:id", protect, customerController.updateCart); 
router.delete("/cart/:id", protect, customerController.deleteCart); 

// Items
router.post("/cart/items", protect, customerController.addItem);
router.put("/cart/items/:id", protect, customerController.updateItem); 
router.delete("/cart/items/:id", protect, customerController.deleteItem); 

// Get All Products in customer page
router.get("/products", getAllProductsValidator, customerController.getAllProducts);

module.exports = router;


/**
 * ===========================
 *      Swagger Docs
 * ===========================
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer related APIs
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get logged-in customer profile
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     responses:
 *       200:
 *         description: Customer profile fetched successfully
 *       500:
 *         description: Error fetching profile
 *
 *   put:
 *     summary: Update customer profile
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/customers/stores/{storeId}:
 *   get:
 *     summary: Get store details with its products
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Store details fetched
 *       404:
 *         description: Store not found
 */

/**
 * @swagger
 * /api/customers/checkout:
 *   post:
 *     summary: Place a new order (COD)
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     variant:
 *                       type: object
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 */

/**
 * @swagger
 * /api/customers/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 */

/**
 * @swagger
 * /api/customers/orders/{orderId}/track:
 *   get:
 *     summary: Track order status
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order status
 */

/**
 * @swagger
 * /api/customers/cart:
 *   get:
 *     summary: Get all carts
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *   post:
 *     summary: Create a new cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 */

/**
 * @swagger
 * /api/customers/cart/{id}:
 *   get:
 *     summary: Get one cart with items
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *   put:
 *     summary: Update a cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *   delete:
 *     summary: Delete a cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 */

/**
 * @swagger
 * /api/customers/cart/items:
 *   post:
 *     summary: Add item to a cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 */

/**
 * @swagger
 * /api/customers/cart/items/{id}:
 *   put:
 *     summary: Update an item in a cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *   delete:
 *     summary: Delete an item from a cart
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 */

/**
 * @swagger
 * /api/customers/products:
 *   get:
 *     summary: Get all products (with filters and search)
 *     tags: [Customers]
 *     security:
 *       - customerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products list
 */