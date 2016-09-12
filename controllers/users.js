// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYnNvbnR5cGUiOiJPYmplY3RJRCIsImlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbODcsMjE0LDEyMywyNSwxODQsMTM2LDIxOCwxNSwwLDE3NSwyMzMsMF19LCJpYXQiOjE0NzM2NzQwMDksImV4cCI6MTQ3Mzc2MDQwOX0.wDu5jIovv9oFsglhsf-3zIyyARBAVXS0MEO7taFE2lk"


module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete
};

const User = require("../models/user");

function usersIndex(req, res) {
  User.find((err, users) => {
    if(err) return res.status(500).json({ message: "Something went wrong "});
    return res.status(200).json({ users });
  });
}

function usersShow(req, res) {
  User.findById(req.params.id, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong "});
    if(!user) return res.status(404).json({ message: "User not found."});
    return res.status(200).json({ user });
  });
}

function usersUpdate(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body.user, {new: true}, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" });
    if(!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  });
}

function usersDelete(req, res) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong "});
    if(!user) return res.status(404).json({ message: "User not found "});
    return res.status(204).send();
  });
}
