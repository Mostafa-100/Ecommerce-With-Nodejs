const { validationResult } = require("express-validator");
const { selectFields } = require("express-validator/lib/field-selection");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};

    errors.array().forEach((error) => {
      const field = error.path;
      const msg = error.msg;

      if (formattedErrors[field]) {
        const isLastErrorsArray = Array.isArray(formattedErrors[field]);
        const lastErrors = isLastErrorsArray
          ? formattedErrors[field]
          : [formattedErrors[field]];
        formattedErrors[field] = [...lastErrors, msg];
        return;
      }
      formattedErrors[field] = msg;
    });

    return res.status(400).json({ errors: formattedErrors });
  }

  return next();
};

module.exports = validateRequest;
