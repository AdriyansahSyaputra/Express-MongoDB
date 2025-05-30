const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  registerValidation,
  validateRegister,
  loginValidation,
  validateLogin,
} = require("../validators/authValidators");

// Route Auth
router.get("/", (req, res) => {
  res.render("./pages/auth/auth", {
    title: "Authentication",
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully.");
  res.redirect("/");
});

router.post("/register", registerValidation, validateRegister, register);
router.post("/login", loginValidation, validateLogin, login);

module.exports = router;
