const express = require("express");
const router = express.Router();
const { createPost, fetchCategories } = require("../controllers/postController");
const upload = require("../middlewares/upload");

router.get("/", (req, res) => {
    res.render("./pages/dashboard/home", { title: "Home" });
})

router.get("/posts", (req, res) => {
    res.render("./pages/dashboard/posts", { title: "Posts" });
})

// Route new Post
router.get("/posts/new", async (req, res) => {
    const categories = await fetchCategories();
    res.render("./pages/dashboard/add-post", { title: "Add Post", categories });
})

router.post("/posts/new", upload.single("featuredImage"), createPost);

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