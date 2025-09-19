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
router.put("/coverage/:id", protect, DeliveryController.updateCoverage);
router.delete("/coverage/:id", protect, DeliveryController.deleteCoverage);

module.exports = router;
