const express     = require("express");
const morgan      = require("morgan");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const cors        = require("cors");

const app = express();
const config = require("./config/config");
const router = require("./config/routes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

app.listen(config.port, () => console.log(`The app is set up on: ${config.port}`));
