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
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    })
    .custom((categories) => {
      if (!categories || categories.length === 0) {
        throw new Error("At least one category must be selected");
      }
      return true;
    })
    .custom(async (categories) => {
      const found = await Category.find({ _id: { $in: categories } });
      if (found.length !== categories.length) {
        throw new Error("One or more categories not found");
      }
      return true;
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
  const customErrors = req.validationErrors || [];

  // Gabungkan errors dari express-validator dan custom errors
  const allErrors = [...errors.array(), ...customErrors];

  if (allErrors.length > 0) {
    // Hapus file jika ada error
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

    // Mapping errors berdasarkan field
    const mappedErrors = {};
    allErrors.forEach((err) => {
      const field = err.path || err.param;
      if (!mappedErrors[field]) {
        mappedErrors[field] = err.msg;
      }
    });

    // console.log("Mapped Errors:", mappedErrors); // Debug log
    // console.log("Request Body:", req.body); // Debug log

    // Set flash messages
    req.flash("errors", mappedErrors);
    req.flash("old", req.body);

    return res.redirect("/dashboard/posts/new");
  }

  next();
};

module.exports = { createPostValidator, validate };
