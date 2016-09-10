module.exports = {
  register: usersRegister,
  login:    usersLogin
};

const User = require("../models/user");

function usersRegister(req, res) {
  User.create(req.body.user, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" });
    return res.status(201).json({ user });
  });
}

function usersLogin(req, res) {
  User.findOne({ username: req.body.username}, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" });
    return res.status(201).json({ username });
  });
}
