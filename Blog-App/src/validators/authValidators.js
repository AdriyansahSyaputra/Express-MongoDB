const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("name")
    .isLength({ min: 7 })
    .withMessage("Name must be at least 7 characters long")
    .bail()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name must contain only letters and spaces")
    .trim(),

  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  body("phone").isMobilePhone("id-ID").withMessage("Invalid phone number"),

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

const validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((err) => {
      errorMessages[err.param] = err.msg;
    });

    req.flash("errors", errorMessages);
    req.flash("old", req.body);
    req.flash("activeTab", "register");
    return res.redirect("/auth#register");
  }

  next();
};

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      errorMessages[error.param] = error.msg;
    });

    req.flash("errors", errorMessages);
    req.flash("old", req.body);
    return res.redirect("/auth#login");
  }

  next();
};

module.exports = {
  registerValidation,
  validateRegister,
  loginValidation,
  validateLogin,
};
