const slugify = require("slugify");

module.exports = function generateSlug(title) {
  return slugify(title, { lower: true, strict: true });
};
