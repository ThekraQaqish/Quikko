const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');
const { protect } = require('../../middleware/authMiddleware');

// POST /reviews
router.post('/', protect, reviewController.addReview);

module.exports = router;
