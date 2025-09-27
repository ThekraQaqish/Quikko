const express = require("express");
const router = express.Router();
const userController = require("../user/userController");

router.put("/:id/fcm-token", userController.updateFcmToken);

module.exports = router;


/* =================== Swagger Documentation =================== */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
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
 *   /api/users/{id}/fcm-token:
 *     put:
 *       summary: Update FCM token for a user
 *       tags: [Users]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *             type: integer
 *           description: User ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - fcmToken
 *               properties:
 *                 fcmToken:
 *                   type: string
 *                   description: Firebase Cloud Messaging token
 *       responses:
 *         200:
 *           description: FCM token updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "FCM token updated successfully"
 *         400:
 *           description: fcmToken is required
 *         500:
 *           description: Internal server error
 */