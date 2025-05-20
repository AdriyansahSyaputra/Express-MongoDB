const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  registerValidation,
  validate,
} = require("../validators/authValidators");

// Route Auth
router.get("/", (req, res) => {
  res.render("./pages/auth/auth", {
    title: "Authentication",
  });
});

router.post("/register", registerValidation, validate, register);
router.post("/login", login)
module.exports = router;
