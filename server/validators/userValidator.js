const {body} = require("express-validator");

exports.registerValidator = [
  body('fullname').notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('Invalid email.'),
  body('password').isLength({ min: 8 }).withMessage('Password too short.'),
  body("confirmPassword").custom((value, {req}) => value === req.body.password),
]