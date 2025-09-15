const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { createProductValidator } = require("./productValidators");

// GET /products/:id
router.get('/:id', productController.getProduct);

// POST /products
router.post("/", createProductValidator, productController.createProduct);

// PUT /products/:id
router.put("/:id", productController.updateProduct);

// DELETE /products/:id
router.delete("/:id", productController.deleteProduct);

module.exports = router;
