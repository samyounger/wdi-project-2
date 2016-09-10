const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const config = require("./config/config");
const router = require("./config/router");

mongoose.connect(config.db);

app.use(mogan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api");

app.listen(config.port, () => console.log(`The app is set up on: ${config.port}`));
