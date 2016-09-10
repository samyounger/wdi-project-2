const express = require("express");
const router = express.Router();

const authentications = require("../controllers/authentications");
const bars = require("../controllers/bars");
const statics = require("../controllers/statics");

// Home page rendering the index.html file
router.route("/")
  .get(statics.home);

// Page to show bars listed in the barpleeze database
router.route("/bars")
  .get(bars.index);

// Authentication for creating and logging in users
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

module.exports = router;
