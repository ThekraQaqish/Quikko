// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");

// delivery company can edit the stsus of orders
// GET /delivery/orders/:id
router.put("/orders/:id", DeliveryController.updateStatus);

//tracking a specific order info 
// GET /delivery/tracking/:orderId
router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);

//to get a specific company coverage area
// GET /delivery/coverage/:companyId
router.get("/coverage/:companyId", DeliveryController.getCoverageById);

//get profile info
// GET /delivery/profile
router.get("/profile", DeliveryController.getProfile);

// edit profile info name,areas
// PUT /delivery/profile
router.put("/profile", DeliveryController.updateProfile);

module.exports = router;
