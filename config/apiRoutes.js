const express = require("express");
const router  = express.Router();

const authentications = require("../controllers/authentications");
const bars            = require("../controllers/bars");
const users           = require("../controllers/users");

// Authentication for creating and logging in users
router.route("/register")
  .post(authentications.register);
router.route("/login")
  .post(authentications.login);

// User routes
// router.route("/users")
//   .get(users.index);
router.route("/users/:id")
  .get(users.show)
  .put(users.update)
  .delete(users.delete);
router.route("/users/:id/bars")
  .post(bars.create);  // new to save favourite bars


// Page to show bars listed in the barpleeze database
router.route("/bars")
  .get(bars.index);
router.route("/bar/:id")
  .get(bars.data);

module.exports = router;
