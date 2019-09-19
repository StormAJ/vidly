const config = require("config");
const morgan = require("morgan");
const debug = require("debug")("app:startup"); // function with namespace

module.exports = function() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  }

  // console.log("Application Name: " + config.get("name"));
  // console.log("Mail Server: " + config.get("mail.host"));
  // // console.log("Mail Password: " + config.get("mail.password"));

  // console.log(`NODE_ENV: ${process.env.NODE_ENV}`); // equates app.get('env')
  // // process.env.NODE_ENV = "production";
  // if (app.get("env") === "development") {
  //   app.use(morgan("tiny")); // logges on the console http requests in a defined format 'tiny'
  //   debug("Morgan enabled .."); // promts to console.log if environment varible set DEBUG=app:startup
  //   //console.log("Morgan enabled ..");
  // }
};
