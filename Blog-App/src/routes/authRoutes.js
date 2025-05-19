const express = require("express");
const router = express.Router();

// Route Login
router.get("/", (req, res) => {
    res.render("./pages/auth/auth", { title: "Authentication" });
})

module.exports = router;