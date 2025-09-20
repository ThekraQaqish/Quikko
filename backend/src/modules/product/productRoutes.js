const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { createProductValidator } = require("./productValidators");
const { protect } = require("../../middleware/authMiddleware");

router.get('/:id', productController.getProduct);

router.post("/", protect, createProductValidator,productController.createProduct);

router.put("/:id", protect, productController.updateProduct);

router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;



/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management endpoints
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
 *   /api/products/{id}:
 *     get:
 *       summary: Get product by ID
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Product details
 *         404:
 *           description: Product not found
 *         500:
 *           description: Internal server error
 *
 *     put:
 *       summary: Update product by ID
 *       tags: [Products]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock_quantity:
 *                   type: integer
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 category_id:
 *                   type: integer
 *                 variants:
 *                   type: array
 *                   items:
 *                     type: object
 *       responses:
 *         200:
 *           description: Product updated successfully
 *         404:
 *           description: Product not found
 *         500:
 *           description: Internal server error
 *
 *     delete:
 *       summary: Delete product by ID
 *       tags: [Products]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: Product deleted successfully
 *         404:
 *           description: Product not found
 *         500:
 *           description: Internal server error
 *
 *   /api/products:
 *     post:
 *       summary: Add a new product
 *       tags: [Products]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - price
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock_quantity:
 *                   type: integer
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                 category_id:
 *                   type: integer
 *                 variants:
 *                   type: array
 *                   items:
 *                     type: object
 *       responses:
 *         201:
 *           description: Product added successfully
 *         400:
 *           description: Validation error
 *         500:
 *           description: Internal server error
 */