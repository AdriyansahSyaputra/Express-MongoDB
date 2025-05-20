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
  })
);
app.use(flash());

// Middleware untuk menyediakan flash messages ke semua views - PERBAIKAN
app.use((req, res, next) => {
  // PENTING: Pastikan errors adalah objek, bukan string atau array
  const errors = req.flash('errors')[0] || {};
  const old = req.flash('old')[0] || {};
  const activeTab = req.flash('activeTab')[0] || 'login';
  const success = req.flash('success')[0];
  
  // Mengisi res.locals untuk digunakan di semua views
  res.locals.success = success;
  res.locals.errors = errors;
  res.locals.old = old;
  res.locals.activeTab = activeTab;
  
  // Debug logs - penting untuk melihat data yang diteruskan ke view
  if (Object.keys(errors).length > 0 || success) {
    console.log("======= DEBUG FLASH MESSAGES =======");
    console.log("Success:", success);
    console.log("Errors:", errors);
    console.log("Old data:", old);
    console.log("Active Tab:", activeTab);
    console.log("====================================");
  }
  
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
