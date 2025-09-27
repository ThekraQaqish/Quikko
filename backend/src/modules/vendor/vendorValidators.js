const { body, validationResult } = require('express-validator');

/**
 * ===============================
 * Vendor Validators
 * ===============================
 * @module vendorValidators
 * @desc Validation middleware for vendor-related requests, e.g., updating order status.
 */

/**
 * Validate request body when updating order status
 * @middleware
 * @function updateOrderStatusValidator
 * @throws {400} Bad Request if validation fails
 * 
 * Validations:
 * - `status` is required
 * - `status` must be one of ['pending', 'shipped', 'delivered', 'cancelled']
 * 
 * @example
 * router.put('/orders/:id', protect, updateOrderStatusValidator, vendorController.updateOrderStatus);
 */
exports.updateOrderStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
