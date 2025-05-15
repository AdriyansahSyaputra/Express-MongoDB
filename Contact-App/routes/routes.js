const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const {
  createContact,
  updateContact,
} = require("../controllers/contactController");
const {
  validateAddContact,
  validateUpdateContact,
} = require("../validators/contactValidator");

// Home Page
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Contact
router.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", { title: "Contact", contacts, msg: req.flash("msg") });
});

// Add Contact
router.get("/contact/add", (req, res) => {
  res.render("add-contact", { title: "Add Contact" });
});

// Proses add contact
router.post("/contact", validateAddContact, createContact);

// Proses delete contact
router.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body.id }).then((result) => {
    req.flash("msg", "Contact deleted successfully!");
    res.redirect("/contact");
  });
});

// Route Edit
router.get("/contact/edit/:id", async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("edit-contact", { title: "Edit Contact", contact });
});

// Proses Update
router.put("/contact", validateUpdateContact, updateContact);

// Detail Contact
router.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", { title: "Detail Contact", contact });
});

module.exports = router;
