const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const changeValidationErrorsResponseFormat = require("../middlewares/changeValidationErrorsResponseFormat");

router.post(
  "/register",
  registerValidator,
  changeValidationErrorsResponseFormat,
  authController.register
);

router.post(
  "/login",
  loginValidator,
  changeValidationErrorsResponseFormat,
  authController.login
);

module.exports = router;
