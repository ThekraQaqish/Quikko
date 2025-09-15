const express = require('express');
const router = express.Router();
const vendorController = require('./vendorController');

// GET /stores
router.get('/', vendorController.getVendors);

module.exports = router;