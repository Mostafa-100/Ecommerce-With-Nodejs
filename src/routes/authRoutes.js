const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const validateRequest = require("../middlewares/validateRequest");

const withValidation = (validator, handler) => [
  validator,
  validateRequest,
  handler,
];

router.post(
  "/register",
  ...withValidation(registerValidator, authController.register)
);

router.post("/login", ...withValidation(loginValidator, authController.login));

router.post(
  "/password-reset-email-request",
  authController.requestPasswordReset
);

router.post(
  "/reset-password",
  ...withValidation(resetPasswordValidator, authController.resetPassword)
);

module.exports = router;
