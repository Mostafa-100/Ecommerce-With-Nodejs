const validateRequest = require("../middlewares/validateRequest");

const withValidation = (validator, handler) => [
  validator,
  validateRequest,
  handler,
];

module.exports = withValidation;
