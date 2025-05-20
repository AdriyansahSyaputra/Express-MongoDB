const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("name")
    .isLength({ min: 7 })
    .withMessage("Name must be at least 7 characters long")
    .trim(),

  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  body("phone").isMobilePhone("id-ID").withMessage("Invalid phone number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // PERBAIKAN: Format field menggunakan "confirm[password]" di alih-alih "confirm-password"
  body("confirm-password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  body("terms").custom((value) => {
    // PERBAIKAN: Periksa nilai terms dengan benar
    if (!value) {
      throw new Error("You must agree to the terms and conditions");
    }
    return true;
  }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Untuk debugging - PENTING
  console.log("Validation errors raw:", errors.array());

  // PERBAIKAN: Format error yang sesuai dengan EJS template
  const extractedErrors = {};

  errors.array().forEach((err) => {
    if (err.param === "confirm-password") {
      // PENTING: Ubah nama field untuk confirm password
      extractedErrors["confirm[password]"] = err.msg;
    } else {
      extractedErrors[err.param] = err.msg;
    }
  });

  console.log("Formatted errors for view:", extractedErrors);

  // Teruskan error ke flash
  req.flash("errors", extractedErrors);
  req.flash("old", req.body);
  req.flash("activeTab", "register");

  // Redirect kembali ke halaman auth dengan fragment register
  return res.redirect("/auth#register");
};

module.exports = {
  registerValidation,
  validate,
};
