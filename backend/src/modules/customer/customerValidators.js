const { query } = require("express-validator");

exports.getAllProductsValidator = [
  query("search").optional().isString().withMessage("Search must be a string"),

  query("categoryId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be >= 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage("Limit must be between 1 and 100"),
];
