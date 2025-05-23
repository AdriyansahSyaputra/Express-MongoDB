const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1];

  // Coba ambil dari cookie jika tidak ada di header
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ msg: "Akses ditolak, token tidak ada" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token tidak valid" });
  }
};

module.exports = auth;
