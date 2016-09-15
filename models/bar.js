const mongoose = require("mongoose");

const barSchema = new mongoose.Schema({
  name:           { type: String, trim: true, required: true, unique: true },
  googlePlaceId:  { type: String, trim: true, required: true },
  url:            { type: String, trim: true },
  lat:            { type: Number, required: true },
  lng:            { type: Number, required: true }
},{
timestamps: true
});

module.exports = mongoose.model("Bar", barSchema);
