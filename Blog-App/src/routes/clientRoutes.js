const express = require("express");
const router = express.Router();
const {
  getTrendingPosts,
  getAllPostsSearch,
  detailPost,
} = require("../controllers/postController");

// Route Home
router.get("/", async (req, res) => {
  const posts = await getTrendingPosts();

  res.render("./pages/clients/home", { title: "Home", posts });
});

// Route Blog
router.get("/blog", getAllPostsSearch);

// Route About
router.get("/about", (req, res) => {
  res.render("./pages/clients/about", { title: "About" });
});

// Route Contact
router.get("/contact", (req, res) => {
  res.render("./pages/clients/contact", { title: "Contact" });
});

// Route read post
router.get("/blog/:slug", (req, res) => {
  detailPost(req, res).then((post) => {
    res.render("./pages/clients/read-post", { title: "Read Post", post });
  });
});

module.exports = router;
