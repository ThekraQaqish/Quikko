// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");


router.put("/orders/:id", DeliveryController.updateStatus);


router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);


router.get("/coverage/:companyId", DeliveryController.getCoverageById);


router.get("/profile/:id", DeliveryController.getCompanyProfile);


router.put("/profile/:id", DeliveryController.updateCompanyProfile);



router.get("/orders/:companyId", DeliveryController.listCompanyOrders);


router.post("/coverage/:companyId", DeliveryController.addOrUpdateCoverage);

module.exports = router;
