const express = require("express");
const CustomerController = require("./customerController");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();

//get details for a store by its id
// GET /stores/:id
router.get("/stores/:storeId", CustomerController.fetchStoreDetails);

//post a checkout for a user
// POST /checkout
router.post("/checkout", protect, CustomerController.postOrder);

//get details for one order (for the user who looged in )
//GET //orders/:orderId
router.get("/orders/:orderId", protect, CustomerController.getOrderDetails);

//get the status for specific order
//GET //orders/:orderId/track
router.get("/orders/:orderId/track", protect, CustomerController.trackOrder);