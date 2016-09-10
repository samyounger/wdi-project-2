const express = require("express");
const router = express.Router();

const authentications = require("../controllers/authentications");
const bars = require("../controllers/bars");

// Page to show bars listed in the barpleeze database
router.route("/bars")
  .get(bars.index);

// Authentication for creating and logging in users
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

module.exports = router;
