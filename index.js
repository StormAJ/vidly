const winston = require("winston");
const express = require("express"); // bunch of middleware functions
const app = express();
const config = require("config");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/pg")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// throw errors and promise rejections for testing:
// throw new Error("Test: error thrown");
// const p = Promise.reject(new Error("Test: Promise rejected")); // triggers unhandledRejection
// p.then(() => console.log("Done")).catch(console.log("Promise rejected"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening to port ${port} ..`)
); // returns server object (needed for integration tests only)

module.exports = server;
