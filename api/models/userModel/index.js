const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Mobile number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  dob: {
    type: String,
    required: [true, "Date of birth is required"],
  },
});

module.exports = mongoose.model("User", userSchema);
