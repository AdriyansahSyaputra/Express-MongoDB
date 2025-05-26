const Post = require("../models/Post");
const Category = require("../models/Category");
const dayjs = require("dayjs");
const path = require("path");
const fs = require("fs");

const createPost = async (req, res) => {
  const { title, content, excerpt, categories, tags, status } = req.body;

  // Parse tags
  let parsedTags = [];
  if (tags) {
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        parsedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags.filter(Boolean);
    }
  }

  try {
    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 160),
      categories,
      tags: parsedTags.map((tag) => tag.trim().toLowerCase()),
      status: status || "draft",
      featuredImage: req.file ? req.file.filename : null,
      author: req.user._id,
    });

    await post.save();
    req.flash("success", "Post berhasil dibuat.");
    res.redirect("/dashboard/posts");
  } catch (err) {
    console.error("Create Post Error:", err.message);

    // Hapus file jika terjadi error saat save
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../../public/img/uploads/",
        req.file.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Gagal menghapus file:", err.message);
      });
    }

    req.flash("errors", {
      general: "Failed to create post. Please try again.",
    });
    req.flash("old", req.body);
    res.redirect("/dashboard/posts/new");
  }
};

const fetchCategories = async () => {
  try {
    return await Category.find().lean();
  } catch (err) {
    return [];
  }
};

const getAllPosts = async () => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .populate("categories", "name")
      .sort({ createdAt: -1 })
      .lean();

    // format tanggal sebelum dikirim ke EJS
    return posts.map((post) => ({
      ...post,
      formattedDate: dayjs(post.publishedAt).format("DD MMM YYYY"),
    }));
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    return [];
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) return res.status(404).send("Post not found");

    // Delete file image
    if (post.featuredImage) {
      const filePath = path.join(
        __dirname,
        "../../public/img/uploads/",
        post.featuredImage
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Gagal menghapus file:", err.message);
      });
    }

    await Post.findByIdAndDelete(req.params.id);
    req.flash("success", "Post berhasil dihapus.");
    res.redirect("/dashboard/posts");
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).send("Server Error");
  }
}

const editPostForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("categories");

    if(!post) return res.status(404).send("Post not found");

    // Ambil daftar kategori
    const categories = await Category.find();

    res.render("./pages/dashboard/edit-post", {
      title: "Edit Post",
      post,
      categories,
    });
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  createPost,
  fetchCategories,
  getAllPosts,
  deletePost,
  editPostForm
};
