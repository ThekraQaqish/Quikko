const { body, validationResult } = require('express-validator');

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