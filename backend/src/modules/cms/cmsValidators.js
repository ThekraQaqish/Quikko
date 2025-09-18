const { body, validationResult } = require('express-validator');

exports.validateCMS = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['page', 'banner']).withMessage('Type must be "page" or "banner"'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
