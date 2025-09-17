// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");

router.get("/orders/:companyId", DeliveryController.listCompanyOrders);

router.put("/orders/:id", DeliveryController.updateStatus);

router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);

router.get("/coverage/:companyId", DeliveryController.getCoverageById);

router.post("/coverage/:companyId", DeliveryController.addCoverage);

router.get("/profile/:id", DeliveryController.getCompanyProfile);

router.put("/profile/:id", DeliveryController.updateCompanyProfile);

module.exports = router;
