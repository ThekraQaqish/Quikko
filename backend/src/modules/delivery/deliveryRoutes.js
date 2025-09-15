// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");

// delivery company can edit the stsus of orders
// GET api/delivery/orders/:id
router.put("/orders/:id", DeliveryController.updateStatus);

//tracking a specific order info 
// GET api/delivery/tracking/:orderId
router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);

//to get a specific company coverage area
// GET api/delivery/coverage/:companyId
router.get("/coverage/:companyId", DeliveryController.getCoverageById);

//get profile info
// GET api/delivery/profile/:id
router.get("/profile/:id", DeliveryController.getCompanyProfile);

// edit profile info name,areas
// PUT api/delivery/profile/:id
router.put("/profile/:id", DeliveryController.updateCompanyProfile);

//
// GET  api/delivery/orders/:companyId
router.get("/orders/:companyId", DeliveryController.listCompanyOrders);

// POST /coverage/:companyId
router.post("/coverage/:companyId", DeliveryController.addOrUpdateCoverage);

module.exports = router;
