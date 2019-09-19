const mongoose = require("mongoose");

const TestModel = mongoose.model(
  "funnies",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  })
);

exports.TestModel = TestModel;
