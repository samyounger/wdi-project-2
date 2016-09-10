const express = require("express");
const router = express.Router();

const authentications = require("../controllers/authentications");
const bars = require("../controllers/bars");

router.route("/api")
  .get(bars.index);
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

module.exports = router;
