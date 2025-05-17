const express = require("express");
const router = express.Router();

// Route Login
router.get("/login", (req, res) => {
    res.render("./pages/auth/login", { title: "Login" });
})

// Route Register   
router.get("/register", (req, res) => {
    res.render("./pages/auth/register", { title: "Register" });
})

module.exports = router;