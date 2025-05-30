const jwt = require("jsonwebtoken");

const protectRoute =
  (roles = []) =>
  (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/auth");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.render("./pages/404", { title: "404" });
      }
      req.user = decoded;
      next();
    } catch {
      return res.redirect("/auth");
    }
  };

module.exports = protectRoute;
