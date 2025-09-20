const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');

router.get('/', categoryController.getCategories);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints for managing categories
 */
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - customerAuth: []   # أو أي Auth تريد
 *     responses:
 *       200:
 *         description: List of all categories
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
 *                   name:
 *                     type: string
 *                     example: Electronics
 */
