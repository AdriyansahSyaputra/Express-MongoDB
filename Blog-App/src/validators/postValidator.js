const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

const createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 10, max: 150 })
    .withMessage("Title must be between 10 and 150 characters long")
    .custom(async (value) => {
      const post = await Post.findOne({ title: value });
      if (post) {
        throw new Error("Post with this title already exists");
      }
    }),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 100 })
    .withMessage("Content must be at least 100 characters long"),

  body("excerpt")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Excerpt must be at least 50 characters long"),

  body("categories")
    .customSanitizer((value) => {
      return Array.isArray(value) ? value : [value];
    })
    .isArray()
    .withMessage("Categories must be an array")
    .custom(async (categories) => {
      const found = await Category.find({ _id: { $in: categories } });
      if (found.length !== categories.length) {
        throw new Error("One or more categories not found");
      }
    }),

  body("categories.*")
    .isMongoId()
    .withMessage("Each category ID must be valid"),

  body("tags")
    .optional()
    .customSanitizer((value) => {
      // Jika sudah array, biarkan
      if (Array.isArray(value)) return value;

      // Jika string JSON
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Not JSON, try split by comma
      }

      // Jika string biasa, split dengan koma
      if (typeof value === "string") {
        return value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      return [];
    })
    .custom((tagsArray) => {
      if (!Array.isArray(tagsArray)) {
        throw new Error("Tags must be an array");
      }

      for (const tag of tagsArray) {
        if (typeof tag !== "string" || tag.length > 30) {
          throw new Error(
            "Each tag must be a string and at most 30 characters long"
          );
        }
      }

      return true;
    }),

  body("status")
    .optional()
    .isIn(["published", "draft", "scheduled"])
    .withMessage('Status must be "published", "draft", or "scheduled"'),

  body("featuredImage").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Featured image is required");
    }
    return true;
  }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Hapus file jika ada
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

    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.param,
        msg: err.msg,
      })),
    });
  }

  next();
};

module.exports = { createPostValidator, validate };
