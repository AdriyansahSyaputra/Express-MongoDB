const mongoose = require("mongoose");
require("dotenv").config(); 

mongoose
  .connect("mongodb://127.0.0.1:27017/blog-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));