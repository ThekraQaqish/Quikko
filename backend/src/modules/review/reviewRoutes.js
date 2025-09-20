const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');
const { protect } = require('../../middleware/authMiddleware');

router.post('/', protect, reviewController.addReview);

module.exports = router;


/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Vendor reviews endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 *
 * paths:
 *   /api/reviews:
 *     post:
 *       summary: Add a review for a vendor
 *       tags: [Reviews]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - vendor_id
 *                 - rating
 *               properties:
 *                 vendor_id:
 *                   type: integer
 *                 rating:
 *                   type: number
 *                   minimum: 1
 *                   maximum: 5
 *       responses:
 *         201:
 *           description: Review added successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   vendor_id:
 *                     type: integer
 *                   rating:
 *                     type: number
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *         400:
 *           description: Validation error
 *         500:
 *           description: Internal server error
 */