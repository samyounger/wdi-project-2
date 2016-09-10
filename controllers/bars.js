module.exports = {
  index: barsIndex
};

const Bar = require("../models/bar.js");

function barsIndex(req, res) {
  Bar.find({}, (err, bars) => {
    if(err) return res.status(500).json({ message: "Something went wrong "});
    return res.status(200).json({ bars });
  });
}
