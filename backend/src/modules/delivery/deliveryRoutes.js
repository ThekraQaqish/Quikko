// routes/orders.routes.js
const express = require("express");
const router = express.Router();
const DeliveryController = require("./deliveryController");
const { protect } = require("../../middleware/authMiddleware");


router.get("/profile/", protect, DeliveryController.getCompanyProfile);
router.put("/profile", protect, DeliveryController.updateCompanyProfile);
router.put("/orders/:id", protect, DeliveryController.updateOrderStatus);
router.get("/tracking/:orderId", protect, DeliveryController.getTrackingInfo);
router.get("/orders", protect, DeliveryController.listCompanyOrders);
router.get("/coverage", protect, DeliveryController.getCoverage);
router.post("/coverage", protect, DeliveryController.addCoverage);
router.put("/orders/:id", DeliveryController.updateStatus);
router.get("/tracking/:orderId", DeliveryController.getTrackingInfo);
router.get("/coverage/:companyId", DeliveryController.getCoverageById);
router.get("/profile/:id", DeliveryController.getCompanyProfile);
router.put("/profile/:id", DeliveryController.updateCompanyProfile);
router.get("/orders/:companyId", DeliveryController.listCompanyOrders);
router.post("/coverage/:companyId", DeliveryController.addOrUpdateCoverage);

module.exports = router;
