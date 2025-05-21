const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("./pages/dashboard/home", { title: "Home" });
})

router.get("/posts", (req, res) => {
    res.render("./pages/dashboard/posts", { title: "Posts" });
})

router.get("/posts/new", (req, res) => {
    res.render("./pages/dashboard/add-post", { title: "Add Post" });
})

router.get("/posts/edit", (req, res) => {
    res.render("./pages/dashboard/edit-post", { title: "Edit Post" });
})

router.get("/posts/detail", (req, res) => {
    res.render("./pages/dashboard/detail-post", { title: "Detail Post" });
})

router.get("/users", (req, res) => {
    res.render("./pages/dashboard/users", { title: "Users" });
})

module.exports = router;