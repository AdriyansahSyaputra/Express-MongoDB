const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const ejs = require("ejs");

const app = express();

// Set View Engine
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);
app.set("view options", {
  root: path.join(__dirname, "views"),
});

// Set View
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Method Override
app.use(methodOverride("_method"));

// Routes
app.use("/", clientRoutes);
app.use("/auth", authRoutes);

// Simple error handling
app.use((req, res) => {
    res.status(404).render("pages/404", { title: "404" });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port http://127.0.0.1:${port}`);
});