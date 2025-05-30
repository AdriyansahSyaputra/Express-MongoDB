const express = require("express");
const router = express.Router();
const {
  createPost,
  fetchCategories,
  getAllPosts,
  deletePost,
  editPostForm,
  updatePost,
  detailPost,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const {
  createPostValidator,
  validate,
} = require("../validators/postValidator");
const limitWords = require("../utils/limitWords");
const {
  createUserValidator,
  validateUser,
} = require("../validators/userValidators");
const {
  createUser,
  getAllUsers,
  editUserForm,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const protectRoute = require("../middlewares/protectRoute");

router.get("/", protectRoute(["administrator", "author"]), (req, res) => {
  res.render("./pages/dashboard/home", { title: "Home" });
});

router.get(
  "/posts",
  protectRoute(["administrator", "author"]),
  async (req, res) => {
    const posts = await getAllPosts();

    res.render("./pages/dashboard/posts", {
      title: "Posts",
      posts,
      limitWords,
    });
  }
);

// Route new Post
router.get(
  "/posts/new",
  protectRoute(["administrator", "author"]),
  async (req, res) => {
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
  }
);

// Route new Post
router.post(
  "/posts/new",
  upload.single("featuredImage"),
  auth,
  protectRoute(["administrator", "author"]),
  createPostValidator,
  validate,
  createPost
);

// Route delete Post
router.delete(
  "/posts/:id",
  auth,
  protectRoute(["administrator", "author"]),
  deletePost
);

// Route edit Post
router.get(
  "/posts/:id/edit",
  auth,
  protectRoute(["administrator", "author"]),
  editPostForm
);

// Route update Post
router.put(
  "/posts/:id",
  auth,
  protectRoute(["administrator", "author"]),
  upload.single("featuredImage"),
  updatePost
);

// Route detail Post
router.get(
  "/posts/:slug/view",
  protectRoute(["administrator", "author"]),
  (req, res) => {
    detailPost(req, res).then((post) => {
      res.render("./pages/dashboard/detail-post", {
        title: "Detail Post",
        post,
      });
    });
  }
);

// Route Users
router.get(
  "/users",
  protectRoute(["administrator", "author"]),
  async (req, res) => {
    const users = await getAllUsers(req, res);

    res.render("./pages/dashboard/users", { title: "Users", users });
  }
);

// Route new User
router.get(
  "/users/new",
  protectRoute(["administrator", "author"]),
  (req, res) => {
    try {
      res.render("./pages/dashboard/add-user", {
        title: "Add User",
        errors: res.locals.errors || {},
        old: res.locals.old || {},
        success: res.locals.success || null,
      });
    } catch (error) {
      req.flash("errors", { general: "Error loading page. Please try again." });
      res.redirect("/dashboard");
    }
  }
);

router.post("/users/new", auth, createUserValidator, validateUser, createUser);

// Route edit User
router.get(
  "/users/:id/edit",
  auth,
  protectRoute(["administrator", "author"]),
  editUserForm
);

// Route update User
router.put(
  "/users/:id",
  auth,
  protectRoute(["administrator", "author"]),
  updateUser
);

// Route delete user
router.delete(
  "/users/:id",
  auth,
  protectRoute(["administrator", "author"]),
  deleteUser
);

module.exports = router;
