const { validationResult } = require("express-validator");
const Contact = require("../models/contact");

const createContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("add-contact", {
      title: "Add Contact",
      errors: errors.array(),
    });
  }

  try {
    await Contact.create(req.body);

    req.flash("msg", "Contact added successfully!");
    res.redirect("/contact");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const updateContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("edit-contact", {
      title: "Edit Contact",
      errors: errors.array(),
      contact: req.body,
    });
  }

  await Contact.updateOne(
    { _id: req.body.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        jobTitle: req.body.jobTitle,
        birthday: req.body.birthday,
      },
    }
  );

  req.flash("msg", "Contact updated successfully!");
  res.redirect("/contact");
};

module.exports = { createContact, updateContact };
