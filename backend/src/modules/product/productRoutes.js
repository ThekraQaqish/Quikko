const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { createProductValidator } = require("./productValidators");
const { protect } = require("../../middleware/authMiddleware");

// GET /products/:id
router.get('/:id', productController.getProduct);

// POST
router.post("/", protect, createProductValidator,productController.createProduct);

// PUT 
router.put("/:id", protect, productController.updateProduct);

// DELETE 
router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;