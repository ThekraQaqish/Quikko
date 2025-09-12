const express = require('express');
const router = express.Router();
const productController = require('./productController');

// GET /products/:id
router.get('/:id', productController.getProduct);

module.exports = router;
