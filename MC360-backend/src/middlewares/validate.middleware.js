/**
 * validate.middleware.js
 * Request body/param/query validation using express-validator
 * Install: npm install express-validator
 *
 * Usage:
 *   const { validate } = require("../middlewares/validate.middleware");
 *   const { loginRules } = require("../validators/auth.validator");
 *   router.post("/login", loginRules, validate, authController.login);
 */

const { validationResult } = require("express-validator");

/**
 * validate
 * Reads validation errors set by express-validator rules and
 * returns a 422 response if any errors exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field  : e.path || e.param,
      message: e.msg,
    }));

    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors : formatted,
    });
  }

  next();
};

module.exports = { validate };