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
      const {
        title,
        content,
        excerpt,
        categories,
        tags,
        status,
        featuredImage,
      } = req.body;

      // Parse tags dari JSON string
      let parsedTags = [];
      try {
        parsedTags = tags ? JSON.parse(tags) : [];
      } catch (err) {
        console.error("Error parsing tags:", err);
      }

      // Buat post baru
      const post = new Post({
        title,
        content,
        excerpt: excerpt || content.substring(0, 160),
        categories,
        tags: parsedTags.map((tag) => tag.trim().toLowerCase()),
        status: status || "draft",
        featuredImage,
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
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
};

const fetchCategories = async () => {
  try {
    return await Category.find().lean();
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};

module.exports = {
  createPost,
  getCategories,
  fetchCategories,
};
