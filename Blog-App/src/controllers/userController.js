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

// Display data to form edit
const editUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");

    res.render("./pages/dashboard/edit-user", { title: "Edit User", user });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Update user
const updateUser = async (req, res) => {
  const { name, username, email, phone, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");

    user.name = name;
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.role = role;

    await user.save();
    req.flash("success", "User updated successfully!");
    res.redirect("/dashboard/users");
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Server Error");
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("User not found");

    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User deleted successfully!");
    res.redirect("/dashboard/users");
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createUser,
  getAllUsers,
  editUserForm,
  updateUser,
  deleteUser,
};
