const express = require("express");
const router = express.Router();

// Route Home
router.get("/", (req, res) => {
    res.render("./pages/clients/home", { title: "Home" });
})

// Route Blog
router.get("/blog", (req, res) => {
    res.render("./pages/clients/blog", { title: "Blog" });
})

// Route About
router.get("/about", (req, res) => {
    res.render("./pages/clients/about", { title: "About" });
})

// Route Contact
router.get("/contact", (req, res) => {
    res.render("./pages/clients/contact", { title: "Contact" });
})

module.exports = router;