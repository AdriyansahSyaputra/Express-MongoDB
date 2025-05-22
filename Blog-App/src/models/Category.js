const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("save", (next) => {
  if (!this.slug) this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
