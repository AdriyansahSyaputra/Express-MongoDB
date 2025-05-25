const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const DashboardRoutes = require("./routes/dashboardRoutes");
const ejs = require("ejs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
require("../config/db");
require("dotenv").config();

const app = express();

// Set View Engine
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);
app.set("view options", {
  root: path.join(__dirname, "views"),
});

// Set Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set View
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Method Override
app.use(methodOverride("_method"));

// Configuration Flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 3600000 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(flash());

// Middleware untuk menyediakan flash messages ke semua views
app.use((req, res, next) => {
  // Ambil flash messages
  const flashErrors = req.flash("errors");
  const flashOld = req.flash("old");
  const flashSuccess = req.flash("success");
  const flashActiveTab = req.flash("activeTab");

  // Set ke res.locals - pastikan errors adalah objek
  res.locals.errors = flashErrors.length > 0 ? flashErrors[0] : {};
  res.locals.old = flashOld.length > 0 ? flashOld[0] : {};
  res.locals.success = flashSuccess.length > 0 ? flashSuccess[0] : null;
  res.locals.activeTab =
    flashActiveTab.length > 0 ? flashActiveTab[0] : "login";

  next();
});

// Routes
app.use("/", clientRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", DashboardRoutes);

// Simple error handling
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404" });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
