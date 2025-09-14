const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { validateRegister, validateLogin } = require('./authValidators');

// Customer registration
router.post('/register/customer', validateRegister, authController.registerUser);

// Vendor registration
router.post('/register/vendor', validateRegister, authController.registerVendor);

// Delivery registration
router.post('/register/delivery', validateRegister, authController.registerDelivery);

// Login
router.post('/login', validateLogin, authController.login);

module.exports = router;
