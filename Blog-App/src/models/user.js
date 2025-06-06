const mongoose = require("mongoose");

// Definisikan Schema dari User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["viewer", "administrator", "author"],
      default: "viewer",
    },
  },
  {
    timestamps: true,
  }
);

// Buat Model dari Schema
const User = mongoose.model("User", userSchema);

module.exports = User;
