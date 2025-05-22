const multer = require("multer");
const path = require("path");

// Configuration Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img/uploads/"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isExtAllowed = allowedTypes.includes(ext);
  const isMimeAllowed = mime.startsWith("image/");

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar (JPG/JPEG/PNG/GIF)"));
  }
};

// Max Size 2MB
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;