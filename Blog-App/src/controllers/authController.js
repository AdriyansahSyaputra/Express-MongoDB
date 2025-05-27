const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Mengambil hasil validasi
  const errors = validationResult(req);

  // Jika ada error validasi
  if (!errors.isEmpty()) {
    const errorMessages = {};
    errors.array().forEach((error) => {
      errorMessages[error.param] = error.msg;
    });

    req.flash("errors", errorMessages);
    req.flash("old", req.body);
    req.flash("activeTab", "register");
    return res.redirect("/auth#register");
  }

  try {
    // Cek apakah email sudah terdaftar
    const exist = await User.findOne({ email });
    if (exist) {
      req.flash("errors", { email: "Email already exists!" });
      req.flash("old", req.body);
      req.flash("activeTab", "register");
      return res.redirect("/auth#register");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Redirect dengan pesan sukses
    req.flash("success", "User registered successfully!");
    req.flash("activeTab", "login"); // Arahkan ke tab login setelah register berhasil
    return res.redirect("/auth");
  } catch (err) {
    console.error("Registration error:", err);
    req.flash("errors", { server: "Something went wrong!" });
    req.flash("old", req.body);
    req.flash("activeTab", "register");
    return res.redirect("/auth#register");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login khusus admin (tanpa cek ke DB)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminUser = {
        _id: "admin-id",
        email: process.env.ADMIN_EMAIL,
        role: "administrator",
      };
      const token = jwt.sign(
        { _id: adminUser._id, role: "administrator" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      req.flash("success", "Admin login successfully!");
      return res.redirect("/dashboard");
    }

    // Login user biasa
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("errors", { email: "User not found!" });
      req.flash("activeTab", "login");
      return res.redirect("/auth#login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("errors", { password: "Password is incorrect!" });
      req.flash("activeTab", "login");
      return res.redirect("/auth#login");
    }

    const token = jwt.sign(
      { _id: user._id, role: "viewer" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    req.flash("success", "Login successfully!");
    return res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("errors", { server: "Something went wrong!" });
    req.flash("activeTab", "login");
    return res.redirect("/auth#login");
  }
};

module.exports = {
  register,
  login,
};
