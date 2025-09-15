const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");

router.post("/pay", paymentController.createPayment);
router.get("/success", paymentController.executePayment);
router.get("/cancel", paymentController.cancelPayment);

module.exports = router;
