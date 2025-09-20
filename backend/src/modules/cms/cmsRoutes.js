const express = require('express');
const router = express.Router();
const cmsController = require('./cmsController');
const { validateCMS } = require('./cmsValidators');
const { protect, authorizeRole } = require('../../middleware/authMiddleware');

router.get('/', protect, authorizeRole('admin'), cmsController.getAllCMS);

router.post('/', protect, authorizeRole('admin'), validateCMS, cmsController.createCMS);

router.put('/:id', protect, authorizeRole('admin'), validateCMS, cmsController.updateCMS);

router.delete('/:id', protect, authorizeRole('admin'), cmsController.deleteCMS);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: CMS
 *   description: Manage CMS pages and banners (admin only)
 */

/**
 * @swagger
 * /api/cms:
 *   get:
 *     summary: Get all CMS records (pages/banners)
 *     security:
 *       - bearerAuth: []
 *     tags: [CMS]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Optional filter by status
 *     responses:
 *       200:
 *         description: List of CMS records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "About Us"
 *                   content:
 *                     type: string
 *                     example: "<p>Welcome to our platform</p>"
 *                   type:
 *                     type: string
 *                     enum: [page, banner]
 *                     example: "page"
 *                   image_url:
 *                     type: string
 *                     example: "https://example.com/banner.png"
 *                   status:
 *                     type: string
 *                     enum: [active, inactive]
 *                     example: "active"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /api/cms:
 *   post:
 *     summary: Create new CMS record (page or banner)
 *     security:
 *       - bearerAuth: []
 *     tags: [CMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Banner"
 *               content:
 *                 type: string
 *                 example: "<h1>Big Sale!</h1>"
 *               type:
 *                 type: string
 *                 enum: [page, banner]
 *                 example: "banner"
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/banner.png"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *     responses:
 *       201:
 *         description: CMS record created successfully
 */

/**
 * @swagger
 * /api/cms/{id}:
 *   put:
 *     summary: Update CMS record by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [CMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: CMS record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [page, banner]
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: CMS record updated successfully
 *       404:
 *         description: CMS record not found
 */

/**
 * @swagger
 * /api/cms/{id}:
 *   delete:
 *     summary: Delete CMS record by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [CMS]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CMS record deleted successfully
 *       404:
 *         description: CMS record not found
 */