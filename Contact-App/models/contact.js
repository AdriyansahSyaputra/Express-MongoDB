const mongoose = require("mongoose");

const Contact = mongoose.model("Contact", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  birthday: {
    type: Date,
  },
});

module.exports = Contact;
