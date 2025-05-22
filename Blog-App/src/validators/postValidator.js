const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const Category = require("../models/Category");

const createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be between 10 and 100 characters long")
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
    .isLength({ max: 160 })
    .withMessage("Excerpt must be at most 160 characters long"),

  body("categories")
    .isArray()
    .withMessage("Categories must be an array")
    .custom(async (categories) => {
      if (categories) {
        const foundCategories = await Category.find({
          _id: { $in: categories },
        });
        if (foundCategories.length !== categories.length) {
          throw new Error("One or more categories not found");
        }
      }
    }),

  body("tags")
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags) {
        for (const tag of tags) {
          if (typeof tag !== "string" || tag.length > 20) {
            throw new Error(
              "Each tag must be a string and at most 20 characters long"
            );
          }
        }
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["published", "draft", "scheduled"])
    .withMessage('Status must be "published", "draft", or "scheduled"'),

  body("featuredImage")
    .optional()
    .isURL()
    .withMessage("Featured image must be a valid URL"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: errors.array().map((err) => ({
        field: err.param,
        msg: err.msg,
      })),
    });
  }
  next();
};

module.exports = { createPostValidator, validate };