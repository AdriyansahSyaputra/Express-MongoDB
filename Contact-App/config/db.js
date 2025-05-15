const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/contact-app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

// Add 1 data
// const contact1 = new Contact({
//   name: "Ihsan",
//   email: "Ihsan@gmail.com",
//   phone: "08123456789",
// });

// Save to collection
// contact1.save().then((contact) => console.log(contact));
