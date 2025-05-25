const express = require("express");
const router = express.Router();
const {
  createPost,
  fetchCategories,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createPostValidator,
  validate,
} = require("../validators/postValidator");

router.get("/", (req, res) => {
  res.render("./pages/dashboard/home", { title: "Home" });
});

router.get("/posts", (req, res) => {
  res.render("./pages/dashboard/posts", { title: "Posts" });
});

// Route new Post
router.get("/posts/new", async (req, res) => {
  try {
    const categories = await fetchCategories();
    res.render("./pages/dashboard/add-post", {
      title: "Add Post",
      categories,
      // Pastikan variabel ini tersedia di template
      errors: res.locals.errors || {},
      old: res.locals.old || {},
      success: res.locals.success || null,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    req.flash("errors", { general: "Error loading page. Please try again." });
    res.redirect("/dashboard");
  }
});

router.post(
  "/posts/new",
  upload.single("featuredImage"),
  auth,
  createPostValidator,
  validate,
  createPost
);

router.get("/posts/edit", (req, res) => {
  res.render("./pages/dashboard/edit-post", { title: "Edit Post" });
});

router.get("/posts/detail", (req, res) => {
  res.render("./pages/dashboard/detail-post", { title: "Detail Post" });
});

router.get("/users", (req, res) => {
  res.render("./pages/dashboard/users", { title: "Users" });
});

module.exports = router;
