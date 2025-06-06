const { query } = require("express-validator");
const { param } = require("express-validator");

exports.getProductsValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer"),

  query("sort")
    .optional()
    .isIn(["desc", "asc"])
    .withMessage("Sort must be either 'asc' or 'desc'"),
];

exports.getOneProductValidator = [
  param("id").notEmpty().withMessage("id is required"),
];
