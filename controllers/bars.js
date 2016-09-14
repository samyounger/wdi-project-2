module.exports = {
  index: barsIndex,
  data: barsData,
  create: barsCreate
};

const Bar = require("../models/bar.js");
const request = require('request-promise');

function barsIndex(req, res) {
  Bar.find({}, (err, bars) => {
    if(err) return res.status(500).json({ message: "Something went wrong "});
    return res.status(200).json({ bars });
  });
}

function barsData(req, res) {
  let id = req.params.id;
  let key = 'AIzaSyByvlUTw9rHtlxIbic2gCVdhpj-8dK7sTQ';
  let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${key}`;

  request(url).then(data => {
    let json = JSON.parse(data);
    if (!json) return res.status(500).json({ message: "No data returned" });
    return res.status(200).json({ json });
  });
}

function barsCreate(req, res) {
  Bar.create(req.body.bar, (err, user) => {
    if(err) return res.status(500).json({ message: "Something went wrong" });

    return res.status(201).json({
      message: `Bar Saved`,
      user,
      token
    });
  });
}
