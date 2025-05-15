const { body, check } = require("express-validator");
const Contact = require("../models/contact");

const validateAddContact = [
  body("name").custom(async (value) => {
    const duplicate = await Contact.findOne({ name: value });
    if (duplicate) {
      throw new Error("Contact name already used!");
    }
    return true;
  }),
  check("email", "Email is not valid").isEmail(),
  check("phone", "Phone number is not valid").isMobilePhone("id-ID"),
  check("jobTitle", "Job title is required").not().isEmpty(),
  check("birthday", "Birthday is required").not().isEmpty(),
  check("address", "Address is required").not().isEmpty(),
];

const validateUpdateContact = [
  body("name").custom(async (value, { req }) => {
    if (value !== req.body.oldName) {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("Contact name already used!");
      }
    }
    return true;
  }),
  check("email", "Email is not valid").isEmail(),
  check("phone", "Phone number is not valid").isMobilePhone("id-ID"),
  check("jobTitle", "Job title is required").not().isEmpty(),
  check("birthday", "Birthday is required").not().isEmpty(),
  check("address", "Address is required").not().isEmpty(),
];

module.exports = { validateAddContact, validateUpdateContact };
