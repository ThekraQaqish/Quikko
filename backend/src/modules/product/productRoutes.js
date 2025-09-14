const express = require("express");
const router = express.Router();
const productController = require("./productController");
const { createProductValidator } = require("./productValidators");

// POST
router.post("/", createProductValidator,productController.createProduct);

// PUT 
router.put("/:id", productController.updateProduct);

// DELETE 
router.delete("/:id", productController.deleteProduct);

module.exports = router;
