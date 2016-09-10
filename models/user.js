const mongoose = require("mongoose");

// Set up model schema for users logging in

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  email:    { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true },
  passwordConfirm: { type: String, trim: true, required: true }
});

module.exports = ("Users", userSchema);
