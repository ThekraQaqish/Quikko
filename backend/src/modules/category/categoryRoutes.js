const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');

// GET /categories
router.get('/', categoryController.getCategories);

module.exports = router;
