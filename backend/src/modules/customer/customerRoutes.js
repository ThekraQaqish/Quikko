const express = require('express');
const router = express.Router();
const customerController = require('./customerController');
const { protect } = require('../../middleware/authMiddleware');


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

module.exports = router;
