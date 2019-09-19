const winston = require("winston");
// require("winston-mongodb");  // winston-mongodb must not be used during integration tests for unknown reasons
require("express-async-errors"); // wraps express async code in try/catch blocks and and passes undhandled errors to error middleware

module.exports = function() {
  // process.on("uncaughtException", ex => {
  //     // process object is an event emmitter!
  //     console.log("Exception triggered");
  //     winston.error(ex.message, ex);
  //     //process.exit(1);
  //   });

  // alternative to process.on - only valid for uncaught exeptions, not for unhandled rejections:
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "logfile.log" })
  );

  process.on("unhandledRejection", ex => {
    // activated on any promise rejection (also for caught promise rejections)
    throw ex; // calls exception handler
  });

  winston.add(winston.transports.File, { filename: "logfile.log" }); // winston only logs error in the context of express
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/vidly2",
  //   level: "info" // level logged: error, warn, info (no verbose, debug, silly)
  // });
};
