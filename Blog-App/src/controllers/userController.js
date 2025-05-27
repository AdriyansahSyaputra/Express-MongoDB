const User = require("../models/user");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { name, username, email, phone, role, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      phone,
      role,
      password: hashedPassword,
    });
    await user.save();
    req.flash("success", "User created successfully!");
    res.redirect("/dashboard/users");
  } catch (error) {
    console.error(error);

    req.flash("error", "Error creating user!");
    req.flash("old", req.body);
    res.redirect("/dashboard/users");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return users;
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createUser, getAllUsers };
