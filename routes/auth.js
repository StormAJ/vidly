const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body.user);
  if (error) return res.status(400).send("error.detail[0].message");

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid user or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid user or password");
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
