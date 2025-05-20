const { body } = require("express-validator");

exports.registerValidator = [
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Full name is too short")
    .isLength({ max: 30 })
    .withMessage("Full name is too long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password too short.")
    .matches(/[a-z]/)
    .withMessage("Must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Must contain an uppercase letter")
    .matches(/\d/)
    .withMessage("Must contain a number")
    .matches(/[@$!%*?&#]/)
    .withMessage("Must contain a special character"),

  body("isAdmin").optional().isBoolean(),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address"),

  body("password").notEmpty().withMessage("password is required"),
];
