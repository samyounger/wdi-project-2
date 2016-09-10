const express     = require("express");
const morgan      = require("morgan");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const cors        = require("cors");

const app       = express();
const config    = require("./config/config");
const apiRouter = require("./config/apiRoutes");
const webRouter = require("./config/webRoutes");

mongoose.connect(config.db);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use("/", webRouter);
app.use("/api", apiRouter);

app.listen(config.port, () => console.log(`The app is set up on: ${config.port}`));
