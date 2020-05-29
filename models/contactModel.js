const mongoose = require("mongoose");
const slugify = require("slugify");
//const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  phone: {
    type: Number,
    // min: 1,
    required: [true, "Please provide your phone number"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
  },
  //dob: Date,
});

contactSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
