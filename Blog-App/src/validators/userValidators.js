const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const createUserValidator = [
  body("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters long")
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .trim(),

  body("username")
    .isLength({ min: 7 })
    .withMessage("Username must be at least 7 characters long")
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must contain only letters, numbers, and underscores")
    .trim()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username already exists");
      }
    }),

  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
    }),

  body("phone").isMobilePhone("id-ID").withMessage("Invalid phone number"),

  body("role")
    .isIn(["viewer", "administrator", "author"])
    .withMessage("Invalid role"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  body("terms")
    .exists()
    .withMessage("You must agree to the terms")
    .equals("on")
    .withMessage("You must agree to the terms"),
];

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  const customErrors = req.validationErrors || [];

  // Gabungkan errors dari express-validator dan custom errors
  const allErrors = [...errors.array(), ...customErrors];

  if (allErrors.length > 0) {
    // Mapping errors berdasarkan field
    const mappedErrors = {};
    allErrors.forEach((err) => {
      const field = err.path || err.param;
      if (!mappedErrors[field]) {
        mappedErrors[field] = err.msg;
      }
    });

    // console.log("Mapped Errors:", mappedErrors); // Debug log
    req.flash("errors", mappedErrors);
    req.flash("old", req.body);

    return res.redirect("/dashboard/users/new");
  }

  next();
};

module.exports = { createUserValidator, validateUser };
