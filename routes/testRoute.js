const express = require("express");
const router = express.Router();
const { TestModel } = require("../models/testMongoModel");

router.get("/", async (req, res) => {
  const test = await TestModel.find();
  return res.send(test);
});

router.post("/", async (req, res) => {
  let test = new TestModel({
    name: req.body.name
  });
  test = await test.save();
  res.send(test);
});

module.exports = router;
