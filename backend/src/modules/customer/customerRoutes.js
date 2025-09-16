const express = require('express');
const router = express.Router();
const customerController = require('./customerController');
const { protect } = require('../../middleware/authMiddleware');
const { getAllProductsValidator } = require("./customerValidators");


// Customer routes
router.get('/', protect, customerController.getProfile);
router.put('/', protect, customerController.updateProfile);

//get details for a store by its id
// GET /stores/:id
router.get("/stores/:storeId", customerController.fetchStoreDetails);

//post a checkout for a user
// POST /checkout
router.post("/checkout", protect, customerController.postOrder);

//get details for one order (for the user who looged in )
//GET //orders/:orderId
router.get("/orders/:orderId", protect, customerController.getOrderDetails);

//get the status for specific order
//GET //orders/:orderId/track
router.get("/orders/:orderId/track", protect, customerController.trackOrder);

// Get All Cart
router.get("/allCart", protect, customerController.getCart);

// Get one cart by it's id
router.get("/cart/:id", protect, customerController.getOneCart);

// POST Cart
router.post("/cart", protect, customerController.addToCart);

// PUT Cart
router.put("/cart/:id", protect, customerController.updateCart);

// DELETE Cart
router.delete("/cart/:id", protect, customerController.deleteCart);

// Get All Products in customer page
router.get("/products", getAllProductsValidator, customerController.getAllProducts);

module.exports = router;
