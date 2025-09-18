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


// Carts
router.get("/carts", protect, customerController.getAllCarts); // كل السلات
router.get("/cart/:id", protect, customerController.getCartById); // سلة وحدة مع عناصرها
router.post("/cart", protect, customerController.createCart); // إنشاء سلة
router.put("/cart/:id", protect, customerController.updateCart); // تعديل سلة
router.delete("/cart/:id", protect, customerController.deleteCart); // حذف سلة

// Items
router.post("/cart/items", protect, customerController.addItem); // إضافة عنصر
router.put("/cart/items/:id", protect, customerController.updateItem); // تعديل عنصر
router.delete("/cart/items/:id", protect, customerController.deleteItem); // حذف عنصر


// Get All Products in customer page
router.get("/products", getAllProductsValidator, customerController.getAllProducts);

module.exports = router;
