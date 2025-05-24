const Post = require("../models/Post");
const {
  createPostValidator,
  validate,
} = require("../validators/postValidator");
const Category = require("../models/Category");

const createPost = async (req, res) => {
  try {
    // Validasi input
    await Promise.all(
      createPostValidator.map((validation) => validation.run(req))
    );

    validate(req, res, async () => {
      const { title, content, excerpt, categories, tags, status } = req.body;

      // Parse tags (handle berbagai kemungkinan format)
      let parsedTags = [];
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
        } catch (err) {
          parsedTags = tags.split(",").map((t) => t.trim());
        }
      } else if (Array.isArray(tags)) {
        parsedTags = [...tags];
      }

      // Buat post baru
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

      // Simpan post ke database
      await post.save();

      res.status(201).json({
        success: true,
        data: post,
        msg: "Post created successfully!",
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

const fetchCategories = async () => {
  try {
    return await Category.find().lean();
  } catch (err) {
    return [];
  }
};

module.exports = {
  createPost,
  fetchCategories,
};
