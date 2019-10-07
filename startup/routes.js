const express = require("express");

const home = require("../routes/home");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const genres = require("../routes/genres");
const courses = require("../routes/courses");
const rentals = require("../routes/rentals");
const test = require("../routes/testRoute");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const pg = require("../routes/pg");
const error = require("../middleware/error");

const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup"); // function with namespace
const logger = require("../middleware/logger");

module.exports = function(app) {
  //app.set("view engine", "pug"); // does not need to be required before using
  //app.set("views", "./views"); // default templates in folder ./views

  // Call middleware functions:
  app.use(express.json()); // converts the http request data into a json object, accessed by req.body
  // app.use(express.urlencoded({ extended: true })); // read data from request added to url
  // app.use(express.static("public")); // return static content from folder "./pulbic" on http request to url "/filename"
  // app.use(helmet());
  app.use("/", home);
  app.use("/api/vidly/genres", genres);
  app.use("/api/vidly/customers", customers);
  app.use("/api/vidly/movies", movies);
  app.use("/api/vidly/rentals", rentals);
  app.use("/api/vidly/test", test);
  app.use("/api/vidly/courses", courses);
  app.use("/api/vidly/users", users);
  app.use("/api/vidly/auth", auth);
  app.use("/api/vidly/returns", returns);
  app.use("/api/vidly/pg", pg);
  app.use(logger); // Custom middleware function added to the http request pipeline
  app.use(error);
};
