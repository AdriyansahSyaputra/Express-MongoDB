const express = require("express");
const routes = require("./routes/routes");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
require("./config/db");

const app = express();

app.use(methodOverride("_method"));

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Configuration flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// routes
app.use("/", routes);

// Simple error handling
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port http://127.0.0.1:${port}`);
});
