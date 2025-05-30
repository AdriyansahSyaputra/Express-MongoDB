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

    if (!post) return res.status(404).send("Post not found");

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
};

// Show data post in edit form
const editPostForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("categories");

    if (!post) return res.status(404).send("Post not found");

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
};

// Update post
const updatePost = async (req, res) => {
  const { title, content, excerpt, categories, tags, status } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).send("Post not found");

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

    post.title = title?.trim();
    post.content = content?.trim();
    post.excerpt = excerpt || content.substring(0, 160);
    post.categories = categories;
    post.tags = parsedTags.map((tag) => tag.trim().toLowerCase());
    post.status = status || "draft";

    if (req.file) {
      // Hapus file lama jika ada
      if (post.featuredImage) {
        const filePath = path.join(
          __dirname,
          "../../public/img/uploads/",
          post.featuredImage
        );
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Gagal menghapus file:", err.message);
        }
      }

      post.featuredImage = req.file.filename;
    }

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

    await post.save();
    req.flash("success", "Post berhasil diperbarui.");
    res.redirect("/dashboard/posts");
  } catch (err) {
    console.error("Error updating post:", err.message);
    res.status(500).send("Server Error");
  }
};

// Show detail data
const detailPost = async (req, res) => {
  try {
    // Temukan data berdasarkan slug
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("categories")
      .populate("author");

    if (!post) return res.status(404).send("Post not found");

    // format tanggal sebelum dikirim ke EJS
    post.formattedDate = dayjs(post.publishedAt).format("MMM DD, YYYY");

    // format tanggal last update
    post.formattedUpdatedAt = dayjs(post.updatedAt)
      .tz("Asia/Jakarta")
      .format("MMM DD, YYYY - hh:mm A");

    return post;
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).send("Server Error");
  }
};

// Ambil 3 data post terbaru
const getTrendingPosts = async () => {
  try {
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("author", "name")
      .populate("categories", "name")
      .lean();
    return posts;
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    return [];
  }
};

// Search Post
const getAllPostsSearch = async (req, res) => {
  const keyword = req.query.search;

  try {
    let filter = { status: "published" };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { excerpt: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }

    let posts = await Post.find(filter)
      .populate("author", "name")
      .populate("categories", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Format tanggal
    posts = posts.map((post) => ({
      ...post,
      formattedDate: dayjs(post.createdAt).format("MMM DD, YYYY"),
    }));

    res.render("./pages/clients/blog", {
      title: "Blog",
      posts,
      keyword,
    });
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).send("Terjadi kesalahan saat memuat data.");
  }
};

module.exports = {
  createPost,
  fetchCategories,
  getAllPosts,
  deletePost,
  editPostForm,
  updatePost,
  detailPost,
  getTrendingPosts,
  getAllPostsSearch,
};
