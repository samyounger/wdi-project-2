const express = require("express");
const router = express.Router();

const statics = require("../controllers/statics");

// Home page rendering the index.html file
router.route("/")
  .get(statics.home);

module.exports = router;
