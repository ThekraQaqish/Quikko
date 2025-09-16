const express = require('express');
const router = express.Router();
const cmsController = require('./cmsController');
const { validateCMS } = require('./cmsValidators');
const { protect, authorizeRole } = require('../../middleware/authMiddleware');

// GET all CMS pages/banners (admin only)
router.get('/cms', protect, authorizeRole('admin'), cmsController.getAllCMS);

// POST create new CMS (admin only)
router.post('/cms', protect, authorizeRole('admin'), validateCMS, cmsController.createCMS);

// PUT update CMS by ID (admin only)
router.put('/cms/:id', protect, authorizeRole('admin'), validateCMS, cmsController.updateCMS);

// DELETE CMS by ID (admin only)
router.delete('/cms/:id', protect, authorizeRole('admin'), cmsController.deleteCMS);

module.exports = router;
