const express = require("express");
const router = express.Router();
const productController = require("./productController");
const { createProductValidator } = require("./productValidators");

// POST
router.post("/products", createProductValidator,productController.createProduct);

// PUT 
router.put("/products/:id", productController.updateProduct);

// DELETE 
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
