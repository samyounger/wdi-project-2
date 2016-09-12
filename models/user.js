const mongoose  = require("mongoose");
const bcrypt    = require("bcrypt");
const validator = require("validator");

// Set up model schema for users logging in

const userSchema = new mongoose.Schema({
  username:         { type: String, trim: true, required: true },
  email:            { type: String, trim: true, required: true },
  passwordHash:     { type: String, trim: true, required: true },
},{
  timestamps: true
});

userSchema
  .virtual("password")
  .set(setPassword);

userSchema
  .virtual("passwordConfirmation")
  .set(setPasswordConfirmation);

userSchema
  .path("passwordHash")
  .validate(validatePasswordHash);

userSchema
  .path("email")
  .validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.passwordHash;
    delete ret.email;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);

function setPassword(value) {
  this._password = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if(this.isNew) {
    if(!this._password) {
      return this.invalidate("password", "A password is required");
    }
    if(this._password.length < 6) {
      this.invalidate("password", "Must be at least 6 characteres");
    }
    if(this._password !== this._passwordConfirmation) {
      return this.invalidate("PasswordConfirmation", "Passwords do not match");
    }
  }
}

function validateEmail(email) {
  if(!validator.isEmail(email)) {
    return this.invalidate("email", "must be a valid email");
  }
}

function validatePassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}
