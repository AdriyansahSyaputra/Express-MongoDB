const express = require("express");
const router = express.Router();
const {
  createPost,
  fetchCategories,
  getAllPosts,
  deletePost,
  editPostForm,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createPostValidator,
  validate,
} = require("../validators/postValidator");
const limitWords = require("../utils/limitWords");

router.get("/", (req, res) => {
  res.render("./pages/dashboard/home", { title: "Home" });
});

router.get("/posts", async (req, res) => {
  const posts = await getAllPosts();

  res.render("./pages/dashboard/posts", { title: "Posts", posts, limitWords });
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

// Route new Post
router.post(
  "/posts/new",
  upload.single("featuredImage"),
  auth,
  createPostValidator,
  validate,
  createPost
);

// Route delete Post
router.delete("/posts/:id", auth, deletePost);

// Route edit Post
router.get("/posts/:id/edit", auth, editPostForm);

router.get("/posts/detail", (req, res) => {
  res.render("./pages/dashboard/detail-post", { title: "Detail Post" });
});

router.get("/users", (req, res) => {
  res.render("./pages/dashboard/users", { title: "Users" });
});

module.exports = router;
